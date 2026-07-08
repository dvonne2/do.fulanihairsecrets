import { google } from 'googleapis';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const sheetId = process.env.SHEET_ID;

    if (!serviceAccountEmail || !privateKey || !sheetId) {
      return res.status(500).json({ 
        ok: false, 
        error: 'Missing environment variables: GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, or SHEET_ID' 
      });
    }

    // Create JWT auth client
    const auth = new google.auth.JWT({
      email: serviceAccountEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    // Initialize Sheets API
    const sheets = google.sheets({ version: 'v4', auth });

    // Append test row
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'Orders!A:K',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [
          [
            new Date().toLocaleString('sv-SE', { timeZone: 'Africa/Lagos' }),
            'TEST-AUTH-001',
            'Auth Test',
            '+2348000000000',
            '',
            'Test row - safe to delete',
            'Lagos',
            'Self Love Plus',
            32750,
            '',
            'auth-test'
          ]
        ]
      }
    });

    return res.status(200).json({ ok: true, data: response.data });
  } catch (error: any) {
    console.error('Sheet test error:', error);
    return res.status(500).json({ ok: false, error: error.message });
  }
}
