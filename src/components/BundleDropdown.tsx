import React, { useState, useRef, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
// Extend your existing Package type with these fields, or merge below into it.

export interface BundleItem {
  name: string;
  qty: number;
  freeQty: number;
  freeName: string;
}

export interface BundlePackage {
  id: string;
  name: string;
  subtitle?: string;
  price: number;
  originalPrice: number;
  badge: "popular" | "best_value" | null;
  description?: string;
  bestFor: string;
  bestForColor: string;
  bestForBg: string;
  socialProof?: string | null;
  items: BundleItem[];
}

export interface BundleDropdownProps {
  packages: BundlePackage[];
  value: string;                      // selected package id — wire to form.pkg
  onChange: (pkg: BundlePackage) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n: number) => "₦" + n.toLocaleString("en-NG");

// ─── Per-bundle identity colours ──────────────────────────────────────────────
const CARD_COLORS: Record<string, { idle: string; hover: string; sel: string; selBg: string; btn: string }> = {
  self_love_plus:       { idle: "#A5B4FC", hover: "#6366F1", sel: "#4338CA", selBg: "#EEF2FF", btn: "#4338CA" },
  self_love_return:     { idle: "#FCA5A5", hover: "#F97316", sel: "#C2410C", selBg: "#FFF7ED", btn: "#C2410C" },
  self_love_b2gof:      { idle: "#6EE7B7", hover: "#10B981", sel: "#047857", selBg: "#ECFDF5", btn: "#047857" },
  self_love_plus_b2gof: { idle: "#FCA5A5", hover: "#EF4444", sel: "#DC2626", selBg: "#FEF2F2", btn: "#DC2626" },
  family_saves:         { idle: "#FCD34D", hover: "#D97706", sel: "#92400E", selBg: "#FFFBEB", btn: "#92400E" },
};
const DEFAULT_COLOR = { idle: "#D1D5DB", hover: "#6B7280", sel: "#111827", selBg: "#F9FAFB", btn: "#111827" };

// ─── Inject keyframes once ────────────────────────────────────────────────────
if (typeof document !== "undefined" && !document.getElementById("bundle-shake-style")) {
  const s = document.createElement("style");
  s.id = "bundle-shake-style";
  s.textContent = `
    @keyframes bundleShake {
      0%,100% { transform: translateX(0); }
      15%      { transform: translateX(-4px); }
      30%      { transform: translateX(4px); }
      45%      { transform: translateX(-3px); }
      60%      { transform: translateX(3px); }
      75%      { transform: translateX(-1px); }
      90%      { transform: translateX(1px); }
    }
    @keyframes cardGlow {
      0%   { box-shadow: 0 0 0px rgba(34,197,94,0); }
      50%  { box-shadow: 0 0 22px rgba(34,197,94,0.45); }
      100% { box-shadow: 0 0 0px rgba(34,197,94,0); }
    }
  `;
  document.head.appendChild(s);
}

// ─── CornerBadge ──────────────────────────────────────────────────────────────
function CornerBadge({ badge }: { badge: BundlePackage["badge"] }) {
  if (!badge) return null;
  const cfg = badge === "popular"
    ? { label: "🔥 MOST POPULAR", bg: "#DC2626", color: "#fff" }
    : { label: "🏆 BEST VALUE",   bg: "#B45309", color: "#fff" };
  return (
    <div style={{
      position: "absolute", top: -2, right: -2,
      background: cfg.bg, color: cfg.color,
      fontSize: 11, fontWeight: 800, padding: "5px 12px",
      borderRadius: "0 10px 0 10px", letterSpacing: "0.04em",
      zIndex: 2,
    }}>
      {cfg.label}
    </div>
  );
}

// ─── ItemRow ──────────────────────────────────────────────────────────────────
function ItemRow({ item }: { item: BundleItem }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8, flexShrink: 0,
        background: "#2D5016", color: "#fff",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 12, fontWeight: 800,
      }}>
        {item.qty}×
      </div>
      <span style={{ fontSize: 14, fontWeight: 500, color: "#111" }}>{item.name}</span>
      {item.freeQty > 0 && (
        <>
          <span style={{ fontSize: 13, color: "#9CA3AF" }}>+</span>
          <div style={{
            border: "1.5px dashed #D97706",
            borderRadius: 8, padding: "3px 10px",
            fontSize: 12, fontWeight: 700, color: "#D97706",
            background: "#FFFBEB",
          }}>
            FREE {item.freeQty} {item.freeName}
          </div>
        </>
      )}
    </div>
  );
}

// ─── BundleCard ───────────────────────────────────────────────────────────────
interface BundleCardProps {
  pkg: BundlePackage;
  isSelected: boolean;
  isHov: boolean;
  onClick: () => void;
  onEnter: () => void;
  onLeave: () => void;
}

function BundleCard({ pkg, isSelected, isHov, onClick, onEnter, onLeave }: BundleCardProps) {
  const discount = Math.round((1 - pkg.price / pkg.originalPrice) * 100);
  const c = CARD_COLORS[pkg.id] ?? DEFAULT_COLOR;
  const borderColor = isSelected ? c.sel : isHov ? c.hover : c.idle;
  const bg = isSelected ? c.selBg : isHov ? c.selBg : "#fff";

  return (
    <div
      onClick={onClick}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        position: "relative", borderRadius: 12, padding: "16px 16px 14px",
        border: `2px solid ${borderColor}`, background: bg,
        cursor: "pointer", transition: "background 0.15s, border-color 0.15s", marginBottom: 2,
        outline: isSelected ? `1px solid ${c.idle}` : "none",
        animation: isHov && !isSelected ? "cardGlow 0.7s ease-out" : "none",
        boxShadow: isHov && !isSelected
          ? "0 0 20px rgba(34,197,94,0.35), 0 4px 20px rgba(0,0,0,0.08)"
          : "0 1px 4px rgba(0,0,0,0.05)",
        filter: isHov && !isSelected ? "brightness(1.02)" : "brightness(1)",
      }}
    >
      <CornerBadge badge={pkg.badge} />

      {/* Name + price */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap", paddingRight: pkg.badge ? 100 : 0 }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 15, color: "#111" }}>{pkg.name}</div>
          {pkg.subtitle && (
            <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>{pkg.subtitle}</div>
          )}
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontSize: 13, color: "#9CA3AF", textDecoration: "line-through" }}>
            {fmt(pkg.originalPrice)}
          </div>
          <div style={{ fontSize: 22, fontWeight: 900, color: "#166534", lineHeight: 1.1 }}>
            {fmt(pkg.price)}
          </div>
          <div style={{
            display: "inline-block", marginTop: 3,
            background: "#FEE2E2", color: "#DC2626",
            fontSize: 11, fontWeight: 800, padding: "2px 7px", borderRadius: 6,
          }}>
            {discount}% OFF
          </div>
        </div>
      </div>

      {/* Items */}
      <div style={{ marginTop: 12 }}>
        {pkg.items.map((item, i) => <ItemRow key={i} item={item} />)}
      </div>

      {/* Description */}
      {pkg.description && (
        <div style={{ fontSize: 12, color: "#4B5563", textAlign: "center", marginTop: 8, lineHeight: 1.5 }}>
          {pkg.description}
        </div>
      )}

      {/* Best for */}
      <div style={{ textAlign: "center", marginTop: 10 }}>
        <span style={{
          fontSize: 12, fontWeight: 700, padding: "4px 14px", borderRadius: 20,
          background: pkg.bestForBg, color: pkg.bestForColor,
        }}>
          Best for: {pkg.bestFor}
        </span>
      </div>

      {/* Social proof */}
      {pkg.socialProof && (
        <div style={{
          marginTop: 10, padding: "8px 12px", borderRadius: 8,
          background: "#ECFDF5", color: "#065F46",
          fontSize: 13, fontWeight: 700, textAlign: "center",
        }}>
          {pkg.socialProof}
        </div>
      )}

      {/* CTA */}
      <div style={{ marginTop: 12 }}>
        {isSelected ? (
          <div style={{
            width: "100%", padding: "12px 0", borderRadius: 10, boxSizing: "border-box",
            background: c.btn, color: "#fff", fontSize: 14, fontWeight: 800,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            letterSpacing: "0.01em",
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="#fff" strokeWidth="1.5" />
              <polyline points="4.5,8 7,10.5 11.5,5.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            ✓ Bundle Selected
          </div>
        ) : (
          <div style={{
            width: "100%", padding: "12px 0", borderRadius: 10, boxSizing: "border-box",
            background: isHov ? c.btn : "#F3F4F6",
            border: isHov ? `2px solid ${c.sel}` : "1.5px solid #D1D5DB",
            color: isHov ? "#fff" : "#374151",
            fontSize: 14, fontWeight: 800,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            transition: "background 0.18s, border-color 0.18s, color 0.18s",
            animation: isHov ? "bundleShake 0.55s ease-out" : "none",
            boxShadow: isHov ? `0 4px 14px ${c.sel}66` : "none",
            letterSpacing: "0.01em",
          }}>
            {isHov ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                Click Here To Buy This Bundle
              </>
            ) : "Click Here To Buy This Bundle"}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── BundleDropdown (main export) ─────────────────────────────────────────────
export function BundleDropdown({ packages, value, onChange }: BundleDropdownProps) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const selected = packages.find((p) => p.id === value) ?? null;

  // Close on outside click
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  // Close on Escape
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, []);

  // Scroll selected card into view when panel opens
  useEffect(() => {
    if (open && value && panelRef.current) {
      const el = panelRef.current.querySelector(`[data-id="${value}"]`);
      if (el) (el as HTMLElement).scrollIntoView({ block: "nearest" });
    }
  }, [open]);

  const discount = selected ? Math.round((1 - selected.price / selected.originalPrice) * 100) : null;

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", width: "100%", fontFamily: "'Segoe UI', system-ui, sans-serif" }}
    >
      {/* ── Trigger ── */}
      <button
        type="button"
        id="bundleSelect"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%", display: "flex", alignItems: "center",
          justifyContent: "space-between", padding: "14px 16px",
          background: "#fff", cursor: "pointer",
          border: `2px solid ${open ? "#D4A017" : "#D4A017"}`,
          borderRadius: "8px",
          transition: "border-color 0.15s", outline: "none",
          boxSizing: "border-box",
        }}
      >
        {selected ? (
          <span style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", minWidth: 0 }}>
            <span style={{ fontWeight: 700, fontSize: 15, color: "#111" }}>{selected.name}</span>
            <span style={{ fontSize: 15, fontWeight: 900, color: "#166534" }}>{fmt(selected.price)}</span>
            <span style={{ fontSize: 12, color: "#9CA3AF", textDecoration: "line-through" }}>{fmt(selected.originalPrice)}</span>
            {discount !== null && (
              <span style={{ fontSize: 11, fontWeight: 800, background: "#FEE2E2", color: "#DC2626", padding: "1px 6px", borderRadius: 6 }}>
                {discount}% OFF
              </span>
            )}
          </span>
        ) : (
          <span style={{ color: "#9CA3AF", fontSize: 15 }}>Choose your bundle…</span>
        )}
        <svg
          width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="#6B7280" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s", flexShrink: 0, marginLeft: 8 }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* ── Card panel ── */}
      {open && (
        <div
          ref={panelRef}
          role="listbox"
          aria-label="Select a bundle"
          style={{
            position: "absolute", top: "100%", left: 0, right: 0, zIndex: 9999,
            background: "#F9FAFB", border: "2px solid #2D5016", borderTop: "none",
            borderRadius: "0 0 16px 16px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
            padding: "10px 10px 14px",
            maxHeight: 800, overflowY: "auto",
            display: "flex", flexDirection: "column", gap: 8,
          }}
        >
          {packages.map((pkg) => (
            <div key={pkg.id} data-id={pkg.id}>
              <BundleCard
                pkg={pkg}
                isSelected={pkg.id === value}
                isHov={pkg.id === hovered}
                onClick={() => { onChange(pkg); setOpen(false); }}
                onEnter={() => setHovered(pkg.id)}
                onLeave={() => setHovered(null)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
