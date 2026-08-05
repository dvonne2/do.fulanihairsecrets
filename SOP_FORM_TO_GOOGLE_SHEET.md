# SOP: How the Website Order Form is Connected to Google Sheets

**Purpose:** Document the exact connection between the website order form and the Google Sheet so it can be replicated on other websites.  
**Scope:** This SOP covers the **live order submission flow** only. No website code was changed to create this document.

---

## 1. Overview

When a customer submits the order form on the website, the browser sends the form data to a Vercel serverless function (`/api/order`). That function then writes the order directly to a Google Sheet using the Google Sheets API v4 and a service account.

There is also a separate **Google Apps Script** endpoint (`src/config/api.ts` / `src/api/storeOrderData.ts`) that is set up for CAPI/Purchase-event order storage, but it is **not currently used by the live order form**. The live form uses the Vercel `api/order.ts` route.

---

## 2. Files Involved

| File | Role |
|------|------|
| `src/components/OrderFormEmbed.tsx` | Frontend order form. Collects input and `POST`s JSON to `/api/order`. |
| `api/order.ts` | Vercel serverless function. Receives the `POST` request and appends a row to Google Sheets. |
| `.env.example` | Lists the three environment variables the backend needs. |
| `src/api/storeOrderData.ts` *(optional)* | Helper for storing/retrieving order data via a Google Apps Script web app. Not used by the live form. |
| `src/config/api.ts` *(optional)* | Holds the Google Apps Script URL and webhook secret. Not used by the live form. |

---

## 3. Data Flow (Step-by-Step)

1. **Customer fills the form** in `src/components/OrderFormEmbed.tsx`.
2. **On submit**, the component builds a JSON payload:
   ```json
   {
     "checkoutAttemptId": "...",
     "name": "Customer Name",
     "phone": "08012345678",
     "whatsapp": "...",
     "email": "customer@email.com",
     "address": "123 Street",
     "state": "Lagos",
     "package": "SELF LOVE PLUS",
     "amount": 32750,
     "deliveryDate": "...",
     "lga": "Ikeja",
     "landmark": "...",
     "deliveryFee": 3000,
     "paymentMethod": "Pay on Delivery",
     "utm_source": "",
     "click_id": "",
     "landing_page_url": "https://..."
   }
   ```
3. **The browser sends it** to the backend:
   ```ts
   const response = await fetch('/api/order', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify(payload),
   });
   ```
4. **`api/order.ts` receives the request**, validates required fields, and generates an order ID.
5. **The function authenticates to Google** using a JWT service account.
6. **It appends a row** to the `Orders` tab in the configured Google Sheet.
7. **It returns `{ ok: true, orderId }`**, and the frontend redirects to the Thank You page.

---

## 4. Backend Details (`api/order.ts`)

### Required environment variables

```bash
GOOGLE_SERVICE_ACCOUNT_EMAIL=sheets-writer@fulani-orders-sheet.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----
...
-----END PRIVATE KEY-----
SHEET_ID=your_google_sheet_id_here
```

### What the function does

```ts
import { google } from 'googleapis';

const sheets = google.sheets({ version: 'v4', auth: jwt });

await sheets.spreadsheets.values.append({
  spreadsheetId: process.env.SHEET_ID,
  range: 'Orders!A:K',
  valueInputOption: 'USER_ENTERED',
  requestBody: {
    values: [[
      new Date().toLocaleString('sv-SE', { timeZone: 'Africa/Lagos' }),
      orderId,
      body.name,
      body.phone,
      body.email || '',
      body.address,
      body.state,
      body.package,
      Number(body.amount),
      body.deliveryDate || '',
      'website'
    ]]
  }
});
```

### Sheet columns written by `api/order.ts`

| Column | Value |
|--------|-------|
| A | Timestamp (`Africa/Lagos`, ISO-like format) |
| B | Generated order ID, e.g. `FHS-XXXX-XXXX` |
| C | Customer name |
| D | Phone number |
| E | Email (empty string if not provided) |
| F | Address |
| G | State |
| H | Package name |
| I | Amount (number) |
| J | Delivery date (empty string if not provided) |
| K | Source (`website`) |

### Required fields the backend checks

- `name`
- `phone`
- `package`
- `state`
- `address`
- `amount`

If any are missing, the request is rejected with `400 Bad Request`.

---

## 5. How to Replicate on Another Website

### 5.1 Create a Google Cloud Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (or use an existing one).
3. Enable the **Google Sheets API** for that project.
4. Go to **IAM & Admin → Service Accounts** and create a service account.
5. Create a JSON key for the service account.
6. Copy the `client_email` value → this is `GOOGLE_SERVICE_ACCOUNT_EMAIL`.
7. Copy the `private_key` value → this is `GOOGLE_PRIVATE_KEY`.  
   *(It will contain `\n` in the JSON file; convert those to actual newlines in the env variable.)*

### 5.2 Create and Share the Google Sheet

1. Create a new Google Sheet.
2. Name the first tab **Orders**.
3. Share the sheet with the service account email, giving it **Editor** permissions.
4. Copy the spreadsheet ID from the URL:  
   `https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit`

### 5.3 Add Environment Variables

In your hosting platform (Vercel, Netlify, etc.), add:

```bash
GOOGLE_SERVICE_ACCOUNT_EMAIL=<client_email>
GOOGLE_PRIVATE_KEY=<private_key_with_actual_newlines>
SHEET_ID=<spreadsheet_id>
```

### 5.4 Add the API Route

Create `api/order.ts` (or the equivalent route in your framework). The core logic is:

```ts
import { google } from 'googleapis';

function getSheets() {
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return google.sheets({ version: 'v4', auth });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const body = req.body;
  const required = ['name', 'phone', 'package', 'state', 'address', 'amount'];
  const missing = required.filter(k => !body[k]);
  if (missing.length) return res.status(400).json({ error: `Missing: ${missing.join(', ')}` });

  const orderId = `ORDER-${Date.now()}`;
  const sheets = getSheets();

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.SHEET_ID,
    range: 'Orders!A:K',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[
        new Date().toISOString(),
        orderId,
        body.name,
        body.phone,
        body.email || '',
        body.address,
        body.state,
        body.package,
        Number(body.amount),
        body.deliveryDate || '',
        'website'
      ]]
    }
  });

  res.status(200).json({ ok: true, orderId });
}
```

### 5.5 Wire the Frontend Form

In the form’s submit handler:

```ts
const response = await fetch('/api/order', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name,
    phone,
    email,
    address,
    state,
    package,
    amount,
    deliveryDate
  })
});

const result = await response.json();
if (result.ok) window.location.href = '/thank-you';
```

### 5.6 Test

1. Submit a test order.
2. Check the `Orders` sheet for the new row.
3. Check the function logs for any `Google Sheets not configured` or `SHEET_ID not set` errors.

---

## 6. Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| `Google Sheets not configured` | `GOOGLE_SERVICE_ACCOUNT_EMAIL` or `GOOGLE_PRIVATE_KEY` missing | Add the env variables. |
| `SHEET_ID not set` | `SHEET_ID` missing | Copy the spreadsheet ID and add it. |
| `Could not record order` / `502` | Service account not shared on the sheet, or wrong `SHEET_ID` | Share the sheet with the service account email and double-check the ID. |
| `Missing: ...` | Required field not sent | Ensure the frontend sends `name`, `phone`, `package`, `state`, `address`, and `amount`. |

---

## 7. Note on the Google Apps Script Helper

`src/api/storeOrderData.ts` and `src/config/api.ts` are configured to send order data to a Google Apps Script web app (`FULANI_API_URL`) for CAPI order tracking. This is **not currently called by the live order form**. If you want to use it later, it requires a separate Google Apps Script with `store_order_data`, `retrieve_order_data`, and `update_order_status` handlers. For the basic order-form-to-sheet flow, the Vercel `api/order.ts` route is enough.
