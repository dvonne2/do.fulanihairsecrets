import React from 'react';

export function LoadingSpinner({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="w-full py-12 flex items-center justify-center">
      <div className="flex items-center gap-3 text-muted-foreground">
        <div
          className="h-4 w-4 rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground animate-spin"
          aria-hidden="true"
        />
        <span className="text-sm">{label}</span>
      </div>
    </div>
  );
}
