// ============================================================================
// FULANI HAIR GRO v16.1 - MASTER OPERATIONS ENGINE (100% AUTOPILOT)
// ============================================================================
//
// WHAT THIS SCRIPT DOES:
// 1. Receives order data from React checkout (doPost)
// 2. Queues for concurrency protection (Webhook Queue)
// 3. Upserts into "All Orders" (11-digit instant capture)
// 4. Auto-assigns Telesales agents via round-robin
// 5. Runs 4-stage WhatsApp recovery on abandoned carts
// 6. Runs 4-stage Commitment Ladder (order → collection)
// 7. Runs 5-stage Post-Delivery Guide (delivery → reorder)
// 8. Sends status notifications to Customer, DA, Sales, Owner
// 9. Enforces anti-fraud: DA cannot collect money or mark PAID
// 10. TRUE SERVER-SIDE Meta CAPI — fires Purchase from Google servers
//
// THREE ENGINES — ONE TRIGGER:
// Partial orders  → Recovery Engine     (get them to complete)
// Pending orders  → Commitment Ladder   (get them to collect)
// Delivered orders → Post-Delivery Guide (get them to reorder)
//
// NO confirmation calls — everything is WhatsApp-automated.
// Meta CAPI fires from THIS server (true server-side, not browser proxy).
//
// SETUP:
// 1. Paste into Extensions → Apps Script (replace ALL old code)
// 2. Run setupTriggers() once from the 🔱 menu
// 3. Deploy as Web App (Execute as: Me, Access: Anyone)
//
// COLUMNS USED:
// AI (col 35) = Recovery Step (Partial orders: 0-4, 99 = killed)
// AJ (col 36) = Commitment Step (Pending+ orders: 0-4)
// AK (col 37) = Post-Delivery Step (Delivered/Paid orders: 0-5)
// AL (col 38) = Delivered Timestamp (set when status changes to Delivered)
//
// ============================================================================

var CONFIG = {
  VERSION: '16.1-TRUE-SERVER-CAPI',
  SPREADSHEET_ID: '1WlIjX8HY02BffyZoQIYNmCdTPFdW0ZcYv9y4sA_ECbA',

  // Sheet Names
  ORDERS_SHEET: 'All Orders',
  DA_SHEET: 'Delivery Agents',
  TELESALES_SHEET: 'Telesales',
  WEBHOOK_QUEUE: 'Webhook Queue',

  WEBHOOK_SECRET: 'fhg_orders_2024_secret',
  TIMEZONE: 'Africa/Lagos',
  BASE_URL: 'https://fulanihairsecrets.com',

  // Statuses
  STATUSES: ['Partial', 'Pending', 'Confirmed', 'Assigned', 'Out for Delivery', 'Delivered', 'Paid', 'Rescheduled', 'Cancelled', 'RTO'],

  // WhatsApp API (eBulkSMS)
  EBULKSMS_USERNAME: 'fulanihairgro@gmail.com',
  EBULKSMS_API_KEY: 'b93172be7c3656e896a15b0a1466374dd6977e9f2587e33ba739c4420816a52b',

  // Before/After Proof Images (Recovery Stage 2)
  PROOF_IMAGE_1: 'https://fulanihairsecrets.com/wp-content/uploads/2021/12/Before-1.png',
  PROOF_IMAGE_2: 'https://fulanihairsecrets.com/wp-content/uploads/2024/11/WhatsApp-Image-2024-11-11-at-15.26.04.jpeg',

  // Product Image (Commitment Ladder — "What's Inside Your Box")
  PRODUCT_IMAGE: 'https://fulanihairsecrets.com/wp-content/uploads/2025/12/Gemini_Generated_Image_mshbcpmshbcpmshb.png',

  // Delivery Fees (Customer-selected)
  DELIVERY_FEES: {
    SAME_DAY: 5000,
    STANDARD: 3000
  },

  // Payment Details
  PAYMENT: {
    BANK: 'Moniepoint',
    ACCOUNT_NAME: 'Fulani Hair Gro',
    ACCOUNT_NUMBER: '5633783114',
    PROOF_PHONE: '08101594734'
  },

  // Team Phones
  TEAM: {
    OWNER: '2348179455117',
    SALES: '2348101594734',
    LOGISTICS: '2348022899383'
  },

  // Packages
  PACKAGES: {
    'SELF LOVE PLUS': { price: 32750, hasShampoo: true, hasPomade: true, hasConditioner: true },
    'SELF LOVE RETURN': { price: 42750, hasShampoo: false, hasPomade: true, hasConditioner: false },
    'SELF LOVE B2GOF': { price: 52750, hasShampoo: true, hasPomade: true, hasConditioner: false },
    'SELF LOVE PLUS B2GOF': { price: 66750, hasShampoo: true, hasPomade: true, hasConditioner: true },
    'FAMILY SAVES': { price: 215000, hasShampoo: true, hasPomade: true, hasConditioner: true }
  },

  // Whale Thresholds
  WHALE_AMOUNT: 215000,       // 🐋 Whale — Family Saves (gold highlight)
  MINI_WHALE_AMOUNT: 66750,   // 🐬 Mini Whale — Self Love Plus B2GOF (light blue highlight)

  // ── Meta CAPI (True Server-Side) ──────────────────────────────
  META_PIXEL_ID: '220381209723501',
  META_ACCESS_TOKEN: 'EAANBi9i7mZAABQLWJEFT1pCHgkBoudFR93ILCLcBNEHJKOA3L2b0eIlOUrgZBtW4OUEJ3MEV6NyAMfXrKExXLQqS5Io3OBh4MHEZBE6vDVBVUe0iTdjwZCNTTzMXZBtrbLKIWm226zrNQO9YRhpFHvpqGjfZBdJrDZB3ZB4uZAN2kxVJAMf7G9DNzxZCPuSqk6V1pe9AZDZD'
};

// ============================================================================
// HARDCODED DELIVERY AGENTS (Fast lookup — no sheet read needed)
// Column layout: V (col 22) = DA Name dropdown, W (col 23) = DA Phone (auto-filled)
// Sorted alphabetically by state. Name format: [State] [Name]
// ============================================================================
var DA_LIST = [
  { name: 'Abuja Moses Makolo',                  phone: '2347087817043', state: 'Abuja' },
  { name: 'Abuja Ugwunwa Chigozie',              phone: '2347064387716', state: 'Abuja' },
  { name: 'Adamawa Isiaka',                      phone: '2348036379836', state: 'Adamawa' },
  { name: 'Akwa Ibom Uko',                       phone: '2348063345125', state: 'Akwa Ibom' },
  { name: 'Anambra Uche',                        phone: '2347037551782', state: 'Anambra' },
  { name: 'Bayelsa Roberta',                     phone: '2348039412593', state: 'Bayelsa' },
  { name: 'Delta Hannaniah',                     phone: '2349037274103', state: 'Delta' },
  { name: 'Delta Inonoje',                       phone: '2347052644129', state: 'Delta' },
  { name: 'Ebonyi Denis',                        phone: '2347039071238', state: 'Ebonyi' },
  { name: 'Edo SamSucc',                         phone: '2349121684681', state: 'Edo' },
  { name: 'Ekiti Fasanya Adeola',                phone: '2348100852850', state: 'Ekiti' },
  { name: 'Enugu Oha Valentine Chibuzo',         phone: '2347011206769', state: 'Enugu' },
  { name: 'Imo Otiwu Wisdom',                    phone: '2347026029064', state: 'Imo' },
  { name: 'Kaduna Ekpa John',                    phone: '2348037272514', state: 'Kaduna' },
  { name: 'Kogi Moses Ehindero',                 phone: '2348066735148', state: 'Kogi' },
  { name: 'Kwara Seun Adewoye',                  phone: '2347032061773', state: 'Kwara' },
  { name: 'Lagos Fadsup',                        phone: '2348166381841', state: 'Lagos' },
  { name: 'Lagos Franklin',                      phone: '2348035117038', state: 'Lagos' },
  { name: 'Lagos Samson',                        phone: '2348136999009', state: 'Lagos' },
  { name: 'Lagos Ubby',                          phone: '2348179455117', state: 'Lagos' },
  { name: 'Nasarawa Adamu',                      phone: '2347032767989', state: 'Nasarawa' },
  { name: 'Niger Moses',                         phone: '2348136701320', state: 'Niger' },
  { name: 'Ondo Betiku',                         phone: '2348030537065', state: 'Ondo' },
  { name: 'Oyo Adigun Enitan',                   phone: '2348075735275', state: 'Oyo' },
  { name: 'Oyo Paul Alabi',                      phone: '2347032461869', state: 'Oyo' },
  { name: 'Oyo Sylvester Oluwatobi Stevenson',   phone: '2347050205904', state: 'Oyo' },
  { name: 'Plateau Mayowa Samuel',               phone: '2347036358503', state: 'Plateau' },
  { name: 'Sokoto Dare Abayomi',                 phone: '2347063417207', state: 'Sokoto' },
  { name: 'Taraba Nafiu Haruna Sale',            phone: '2349031280818', state: 'Taraba' }
];


// ============================================================================
// 4-STAGE RECOVERY LIFECYCLE
// ============================================================================

var RECOVERY_STAGES = [
  { step: 1, delay: 10 },     // 10 Minutes — Concierge Nudge
  { step: 2, delay: 120 },    // 2 Hours — Social Proof Drop
  { step: 3, delay: 1440 },   // 24 Hours — Warm Re-engagement
  { step: 4, delay: 4320 }    // 72 Hours — Goodwill Drop
];


// ============================================================================
// COMMITMENT LADDER (Keeps paying customers locked in until delivery)
// ============================================================================

var COMMITMENT_STAGES = [
  { step: 1, delay: 30 },      // 30 Minutes
  { step: 2, delay: 240 },     // 4 Hours
  { step: 3, delay: 1080 },    // 18 Hours
  { step: 4, delay: 2160 }     // 36 Hours
];


// ============================================================================
// POST-DELIVERY GUIDE (Turns delivered orders into reorders)
// ============================================================================

var POST_DELIVERY_STAGES = [
  { step: 1, delay: 45 },       // 45 Minutes
  { step: 2, delay: 1080 },     // 18 Hours (next morning)
  { step: 3, delay: 4320 },     // 3 Days
  { step: 4, delay: 10080 },    // 7 Days
  { step: 5, delay: 30240 }     // 21 Days
];


// ============================================================================
// META CAPI — TRUE SERVER-SIDE (fires from Google servers, not browser)
// ============================================================================
// Replicates the browser's makeEventId() exactly:
//   sha256("eventname_orderid".trim().toLowerCase()).slice(0, 16)
// This ensures Meta can deduplicate browser pixel + server CAPI events.
// ============================================================================

function sha256ForCAPI(value) {
  var normalized = value.trim().toLowerCase();
  var rawHash = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256, normalized, Utilities.Charset.UTF_8
  );
  var hex = '';
  for (var i = 0; i < rawHash.length; i++) {
    var byte = rawHash[i];
    if (byte < 0) byte += 256;
    hex += ('0' + byte.toString(16)).slice(-2);
  }
  return hex;
}

function makeEventIdServer(eventName, identity) {
  var raw = eventName + '_' + identity;
  return sha256ForCAPI(raw).slice(0, 16);
}

function hashForMeta(value) {
  if (!value) return '';
  return sha256ForCAPI(value);
}

function fireMetaCAPI(eventName, eventId, userData, customData) {
  try {
    var metaUserData = {};
    if (userData.email) metaUserData.em = [hashForMeta(userData.email)];
    if (userData.phone) {
      metaUserData.ph = [hashForMeta(normalizePhone(userData.phone))];
    }
    if (userData.firstName) metaUserData.fn = [hashForMeta(userData.firstName)];
    if (userData.lastName) metaUserData.ln = [hashForMeta(userData.lastName)];
    if (userData.state) metaUserData.st = [hashForMeta(userData.state)];
    if (userData.city) metaUserData.ct = [hashForMeta(userData.city)];
    metaUserData.country = [hashForMeta('ng')];
    if (userData.externalId) metaUserData.external_id = [hashForMeta(userData.externalId)];
    if (userData.fbp) metaUserData.fbp = userData.fbp;
    if (userData.fbc) metaUserData.fbc = userData.fbc;
    if (userData.clientIp) metaUserData.client_ip_address = userData.clientIp;
    if (userData.userAgent) metaUserData.client_user_agent = userData.userAgent;

    var eventData = {
      event_name: eventName,
      event_time: Math.floor(new Date().getTime() / 1000),
      event_id: eventId,
      action_source: 'website',
      event_source_url: CONFIG.BASE_URL + '/',
      user_data: metaUserData,
      custom_data: customData || {}
    };
    if (!eventData.custom_data.currency) eventData.custom_data.currency = 'NGN';

    var payload = JSON.stringify({ data: [eventData] });
    var url = 'https://graph.facebook.com/v21.0/' + CONFIG.META_PIXEL_ID
            + '/events?access_token=' + CONFIG.META_ACCESS_TOKEN;

    var response = UrlFetchApp.fetch(url, {
      method: 'post',
      contentType: 'application/json',
      payload: payload,
      muteHttpExceptions: true
    });

    var code = response.getResponseCode();
    console.log('CAPI ' + eventName + ' [' + eventId + ']: HTTP ' + code
              + ' — ' + response.getContentText());
    return (code >= 200 && code < 300);
  } catch (err) {
    console.error('CAPI Error (' + eventName + '): ' + err.message);
    return false;
  }
}

function fireOrderCAPIEvents(data) {
  var orderId = data.orderId || '';
  var amount = Number(data.totalAmount) || 0;
  var packageName = data.packageName || 'Fulani Hair Gro';
  var paymentType = (data.paymentMethod || 'Pay on Delivery').indexOf('Before') !== -1 ? 'PBD' : 'POD';
  var prefix = paymentType === 'PBD' ? 'pbd' : 'pod';
  var valueEventName = prefix + amount;

  var fbp = data.fbp || '';
  var fbc = data.fbc || '';
  if (!fbc && data.fbclid) {
    fbc = 'fb.1.' + new Date().getTime() + '.' + data.fbclid;
  }

  var userData = {
    email: data.email || '',
    phone: data.phone || '',
    firstName: (data.name || '').split(' ')[0] || '',
    lastName: (data.name || '').split(' ').slice(1).join(' ') || '',
    state: data.state || '',
    city: data.lga || '',
    externalId: orderId,
    fbp: fbp,
    fbc: fbc,
    userAgent: data.userAgent || '',
    clientIp: data.clientIp || ''
  };

  // 1. PURCHASE — event_id matches browser's makeEventId('Purchase', orderId)
  var purchaseId = makeEventIdServer('Purchase', orderId);
  fireMetaCAPI('Purchase', purchaseId, userData, {
    value: amount, currency: 'NGN', content_type: 'product',
    content_name: packageName, num_items: 1
  });

  // 2. VALUE-BASED EVENT (e.g. pod66750)
  var valueId = makeEventIdServer(valueEventName, orderId);
  fireMetaCAPI(valueEventName, valueId, userData, {
    value: amount, currency: 'NGN', content_type: 'product',
    content_name: paymentType + '_' + packageName
  });

  // 3. HIGH VALUE PURCHASE (if >= 50000)
  if (amount >= 50000) {
    var hvpId = makeEventIdServer('HighValuePurchase', orderId);
    fireMetaCAPI('HighValuePurchase', hvpId, userData, {
      value: amount, currency: 'NGN', content_type: 'product',
      content_name: packageName
    });
  }

  console.log('CAPI: All events fired for order ' + orderId);
}


// ============================================================================
// 1. THE DATA GATEKEEPER (Entry Point & Queue)
// ============================================================================

function doPost(e) {
  var startTime = new Date();
  var queueId = 'Q-' + Utilities.formatDate(startTime, CONFIG.TIMEZONE, 'yyMMdd-HHmmss-') + Math.floor(Math.random() * 1000);

  try {
    var raw = null;

    if (e && e.postData && typeof e.postData.contents === 'string') {
      raw = e.postData.contents;
    } else if (e && e.parameter) {
      raw = JSON.stringify(e.parameter);
    } else {
      throw new Error('doPost was run without a webhook request event (e). Deploy as Web App and call the Web App URL.');
    }

    var data = raw ? JSON.parse(raw) : {};
    if (data.secret !== CONFIG.WEBHOOK_SECRET) throw new Error('Unauthorized');

    var ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    var queueSheet = ss.getSheetByName(CONFIG.WEBHOOK_QUEUE) || ss.insertSheet(CONFIG.WEBHOOK_QUEUE);

    queueSheet.appendRow([queueId, startTime, data.type || 'Unknown', 'React-Web', JSON.stringify(data), 'Pending']);
    processWebhookQueue();

    return ContentService.createTextOutput(JSON.stringify({
      success: true, id: queueId, version: CONFIG.VERSION
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    console.error('Webhook Error [' + queueId + ']: ' + err.message);
    return ContentService.createTextOutput(JSON.stringify({
      success: false, error: err.message, id: queueId
    })).setMimeType(ContentService.MimeType.JSON);
  }
}


function processWebhookQueue() {
  var ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  var queueSheet = ss.getSheetByName(CONFIG.WEBHOOK_QUEUE);
  if (!queueSheet || queueSheet.getLastRow() < 2) return;

  var rows = queueSheet.getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    if (rows[i][5] === 'Pending') {
      var rowNum = i + 1;
      try {
        var payload = JSON.parse(rows[i][4]);

        payload.name = payload.name || payload.customerFullName || payload.customerName || '';
        payload.phone = payload.phone || payload.phoneNumber || '';
        payload.packageName = payload.packageName || payload.packageSelected || '';
        payload.address = payload.address || payload.fullAddress || '';

        var rawAmount = payload.totalAmount || payload.packageAmount || payload.productPrice
                     || payload.amount || payload.price || payload.packagePrice || 0;
        payload.totalAmount = Number(rawAmount) || 0;

        if (payload.type === 'complete') {
          console.log('NORMALIZED COMPLETE: ' + JSON.stringify({
            name: payload.name, phone: payload.phone, pkg: payload.packageName,
            amount: payload.totalAmount, delivery: payload.deliveryType, state: payload.state
          }));
        }

        if (payload.type === 'partial') handlePartialOrder(payload);
        else if (payload.type === 'complete') handleCompleteOrder(payload);

        queueSheet.getRange(rowNum, 6).setValue('Processed');
        queueSheet.getRange(rowNum, 7).setValue(new Date());
      } catch (e) {
        queueSheet.getRange(rowNum, 6).setValue('Failed: ' + e.message);
      }
    }
  }
}


// ============================================================================
// 2. LEAD CAPTURE (11-Digit Instant Trigger)
// ============================================================================

function handlePartialOrder(data) {
  var ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  var sheet = ss.getSheetByName(CONFIG.ORDERS_SHEET);
  var rows = sheet.getDataRange().getValues();
  var orderId = data.orderId;
  var phone = normalizePhone(data.phone);

  if (!phone) return;

  var packageName = data.packageName || data.packageSelected || '';
  var packageAmount = Number(data.packageAmount) || 0;

  for (var i = rows.length - 1; i >= 1; i--) {
    if (rows[i][0] == orderId) {
      sheet.getRange(i + 1, 4).setValue(phone);
      sheet.getRange(i + 1, 6).setValue(data.phone);
      if (data.name) sheet.getRange(i + 1, 3).setValue(data.name);
      if (data.email) sheet.getRange(i + 1, 5).setValue(data.email);
      if (packageName) {
        sheet.getRange(i + 1, 7).setValue(packageName);
        sheet.getRange(i + 1, 8).setValue(packageName);
      }
      if (packageAmount > 0) sheet.getRange(i + 1, 10).setValue(packageAmount);
      return;
    }
  }

  var ts = getNextTelesales();
  sheet.appendRow([
    orderId, new Date(), data.name || "", phone, data.email || "", data.phone || "",
    packageName, packageName, "No", packageAmount, "", "", "", "", "", "", "", "", "",
    "Partial", ts.name, "", "", "", "", "", "", "", "", "",
    "No", "", "", ts.phone, 0, 0, 0, ""
  ]);

  var cartMsg = "🛒🛒🛒 *ABANDONED CART* 🛒🛒🛒\n\n"
    + "📞 " + phone + "\n"
    + "👤 Name: " + (data.name || "Not entered yet") + "\n"
    + "📦 Package: " + (packageName || "Not selected yet") + "\n"
    + "💰 Price: " + (packageAmount > 0 ? "₦" + packageAmount.toLocaleString() : "N/A") + "\n"
    + "📍 Location: Not entered yet\n\n"
    + "⚠️ Customer started form but did NOT complete!\n\n"
    + "👤 Assigned to: " + ts.name + "\n"
    + "⏰ Call within 5 mins!\n\n"
    + "🧾 Ref: " + orderId + "\n\n"
    + "💚 Fulani Hair Gro";

  sendWhatsApp(CONFIG.TEAM.OWNER, cartMsg);
  if (ts.phone) sendWhatsApp(ts.phone, cartMsg);
}


// ============================================================================
// ORDER COMPLETION (+ TRUE SERVER-SIDE CAPI)
// ============================================================================

function handleCompleteOrder(data) {
  var ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  var sheet = ss.getSheetByName(CONFIG.ORDERS_SHEET);
  var rows = sheet.getDataRange().getValues();
  var deliveryFee = (data.deliveryType === 'SAME_DAY') ? CONFIG.DELIVERY_FEES.SAME_DAY : CONFIG.DELIVERY_FEES.STANDARD;
  var amount = data.totalAmount || 0;

  for (var i = rows.length - 1; i >= 1; i--) {
    if (rows[i][0] == data.orderId) {
      sheet.getRange(i + 1, 3).setValue(data.name || '');
      sheet.getRange(i + 1, 4).setValue(normalizePhone(data.phone) || '');
      sheet.getRange(i + 1, 5).setValue(data.email || '');
      sheet.getRange(i + 1, 6).setValue(data.phone || '');
      sheet.getRange(i + 1, 7).setValue(data.packageName || '');
      sheet.getRange(i + 1, 8).setValue(data.packageName || '');
      sheet.getRange(i + 1, 10).setValue(amount);
      sheet.getRange(i + 1, 11).setValue(data.state || '');
      sheet.getRange(i + 1, 12).setValue(data.lga || '');
      sheet.getRange(i + 1, 13).setValue(data.address || '');
      sheet.getRange(i + 1, 14).setValue(data.landmark || '');
      sheet.getRange(i + 1, 15).setValue(deliveryFee);
      sheet.getRange(i + 1, 16).setValue(data.deliveryDate || '');
      sheet.getRange(i + 1, 17).setValue(data.deliveryTimeWindow || '');
      sheet.getRange(i + 1, 18).setValue(data.paymentMethod || 'Pay on Delivery');
      sheet.getRange(i + 1, 19).setValue(data.heardAboutUs || '');
      sheet.getRange(i + 1, 20).setValue("Pending");
      sheet.getRange(i + 1, 35).setValue(99); // kill recovery on completed

      if (amount >= CONFIG.WHALE_AMOUNT) {
        sheet.getRange(i + 1, 1, 1, 10).setBackground('#FFF8E1');
      } else if (amount >= CONFIG.MINI_WHALE_AMOUNT) {
        sheet.getRange(i + 1, 1, 1, 10).setBackground('#E3F2FD');
      } else {
        sheet.getRange(i + 1, 1, 1, 10).setBackground('#E8F5E9');
      }

      var orderData = buildOrderData(sheet, i + 1, data);
      sendStatusNotifications('Pending', orderData);

      // ── TRUE SERVER-SIDE CAPI ──
      fireOrderCAPIEvents(data);

      return;
    }
  }

  var ts = getNextTelesales();
  sheet.appendRow([
    data.orderId, new Date(), data.name || "", normalizePhone(data.phone), data.email || "",
    data.phone, data.packageName || "", data.packageName || "", "No", amount,
    data.state || "", data.lga || "", data.address || "", data.landmark || "", deliveryFee,
    data.deliveryDate || "", data.deliveryTimeWindow || "", data.paymentMethod || "Pay on Delivery", data.heardAboutUs || "",
    "Pending", ts.name, "", "", "", "", "", "", "", "", "",
    "No", "", "", ts.phone, 99, 0, 0, ""
  ]);

  var newRow = sheet.getLastRow();
  if (amount >= CONFIG.WHALE_AMOUNT) {
    sheet.getRange(newRow, 1, 1, 10).setBackground('#FFF8E1');
  } else if (amount >= CONFIG.MINI_WHALE_AMOUNT) {
    sheet.getRange(newRow, 1, 1, 10).setBackground('#E3F2FD');
  } else {
    sheet.getRange(newRow, 1, 1, 10).setBackground('#E8F5E9');
  }

  var orderData2 = buildOrderData(sheet, newRow, data);
  sendStatusNotifications('Pending', orderData2);

  // ── TRUE SERVER-SIDE CAPI ──
  fireOrderCAPIEvents(data);
}


// ============================================================================
// 3. TEAM & LOGISTICS LOGIC
// ============================================================================

var TELESALES_LIST = [
  { name: 'Telesales 1', phone: '2348101594734' },
  { name: 'Telesales 2', phone: '2348101594734' }
];

function getNextTelesales() {
  var props = PropertiesService.getScriptProperties();
  var lastIdx = parseInt(props.getProperty('lastTelesalesIndex') || '-1', 10);
  var nextIdx = (lastIdx + 1) % TELESALES_LIST.length;
  props.setProperty('lastTelesalesIndex', nextIdx.toString());
  return { name: TELESALES_LIST[nextIdx].name, phone: TELESALES_LIST[nextIdx].phone };
}

function getDAPhone(daName) {
  if (!daName) return '';
  for (var i = 0; i < DA_LIST.length; i++) {
    if (DA_LIST[i].name === daName) return DA_LIST[i].phone;
  }
  try {
    var ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    var sheet = ss.getSheetByName(CONFIG.DA_SHEET);
    if (!sheet || sheet.getLastRow() < 2) return '';
    var data = sheet.getDataRange().getValues();
    for (var j = 1; j < data.length; j++) {
      if (data[j][0] === daName) return normalizePhone(data[j][1]);
    }
  } catch (e) {}
  return '';
}

function formatPhoneForDisplay(phone) {
  if (!phone) return '';
  phone = String(phone);
  if (phone.startsWith('234') && phone.length === 13) return '0' + phone.substring(3);
  return phone;
}


// ============================================================================
// 4. AUTOPILOT WHALE RECOVERY ENGINE
// ============================================================================

function processCartRecovery() {
  var ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  var sheet = ss.getSheetByName(CONFIG.ORDERS_SHEET);
  if (!sheet || sheet.getLastRow() < 2) return;

  var data = sheet.getDataRange().getValues();
  var now = new Date();
  var recoveryCount = 0;

  for (var i = 1; i < data.length; i++) {
    var status = data[i][19];
    var currentStep = parseInt(data[i][34] || 0, 10);
    var createdAt = new Date(data[i][1]);
    var phone = data[i][3];

    if (status !== 'Partial' || currentStep >= 4 || !phone) continue;

    var diffMins = (now - createdAt) / 60000;
    var nextStage = null;
    for (var s = 0; s < RECOVERY_STAGES.length; s++) {
      if (RECOVERY_STAGES[s].step === (currentStep + 1)) { nextStage = RECOVERY_STAGES[s]; break; }
    }

    if (nextStage && diffMins >= nextStage.delay) {
      var customerName = data[i][2];
      var packageName = data[i][6];
      var amount = data[i][9];
      var orderId = data[i][0];

      var msg = getRecoveryMessage(nextStage.step, packageName, customerName, amount, orderId);
      var sent = sendWhatsApp(phone, msg);

      if (sent) {
        sheet.getRange(i + 1, 35).setValue(nextStage.step);
        recoveryCount++;
        if (amount >= CONFIG.WHALE_AMOUNT) {
          sheet.getRange(i + 1, 1, 1, 10).setBackground('#FFF8E1');
        } else if (amount >= CONFIG.MINI_WHALE_AMOUNT) {
          sheet.getRange(i + 1, 1, 1, 10).setBackground('#E3F2FD');
        }
      }
    }
  }

  if (recoveryCount > 0) console.log('Recovery: Sent ' + recoveryCount + ' messages at ' + now);

  processCommitmentLadder();
  processPostDelivery();
}


// ============================================================================
// 5. RECOVERY MESSAGES (4-Stage Premium Scripts)
// ============================================================================

function getRecoveryMessage(step, packageName, customerName, amount, orderId) {
  var link = CONFIG.BASE_URL + '?orderId=' + orderId;
  var name = customerName || 'there';
  var pkg = (packageName && packageName.toLowerCase().indexOf('not selected') === -1) ? packageName : 'hair growth pack';
  var pkgContents = getPackageContents(pkg);

  if (step == 1) {
    return "Miracle here from *Fulani Hair Gro* 🌿\n\n"
      + "I noticed you started an order but didn't finish, no wahala at all 😊\n"
      + "I just wanted to quickly check in.\n\n"
      + "Can I ask: are you currently dealing with thinning edges, bald spots, or breakage from braids and wigs?\n\n"
      + "✨ Our 400-year Fulani hair formula has helped 10,000+ Nigerian women restore their edges. "
      + "Many start noticing tiny baby hairs within 14 days 😍\n\n"
      + "💯 You only pay when it arrives 🇳🇬\n\n"
      + "🎁 *BEST-VALUE BUNDLES*\n\n"
      + "✨ *SELF LOVE PLUS*\n(1 Shampoo + 1 Pomade + 1 Conditioner)\n₦75,000 ➝ ₦32,750\n\n"
      + "🔥 *SELF LOVE PLUS B2GOF* (Most Popular ⭐)\n(Buy 2 sets, Get 1 set FREE)\n₦150,000 ➝ ₦66,750\n\n"
      + "🛍️ *SELF LOVE B2GOF*\n(Buy 2 Shampoos / Pomades, Get 1 of each FREE)\n₦100,000 ➝ ₦52,750\n\n"
      + "👨‍👩‍👧‍👦 *FAMILY SAVES*\n(6 sets + 4 sets FREE)\n₦250,000 ➝ ₦215,750\n\n"
      + "🧴 *SINGLE PRODUCTS*\n🧼 Shampoo ₦25,000\n🧴 Pomade (Hair Cream) ₦25,000\n💧 Conditioner ₦25,000\n\n"
      + "Whenever you're ready, just send your Name + Delivery Address,\n"
      + "and I'll lock everything in for you immediately ✅\n\n"
      + "🔗 " + link;
  }

  if (step == 2) {
    return "Hi " + name + " 😊\n"
      + "I wanted to share something with you real quick.\n\n"
      + "We've had hundreds of women across Nigeria use Fulani Hair Gro and the pattern is always the same:\n\n"
      + "👉 *Customer 1* was dealing with severe thinning at the roots from tight braiding. "
      + "What changed first wasn't length, it was scalp health and density.\n\n"
      + "👉 *Customer 2* had slow growth and weak strands. "
      + "After staying consistent with the routine, her hair became stronger, fuller, and longer.\n\n"
      + "What matters isn't one miracle result, it's the *pattern*.\n"
      + "Different women. Different hair issues. Same response once the follicle is properly nourished 🌿\n\n"
      + "That's why our 400-year Fulani formula has such a high reorder rate.\n\n"
      + "Most customers choose:\n\n"
      + "🔥 *SELF LOVE PLUS B2GOF* ₦66,750\n"
      + "(3 full sets = complete 90-day restoration cycle)\n"
      + "📋 *What's inside:* 2 Shampoo + 2 Pomade + 2 Conditioner + FREE 1 of each\n\n"
      + "💯 Pay on Delivery 🇳🇬 zero risk.\n\n"
      + "Whenever you're ready, just send Name + Delivery Address,\n"
      + "and I'll take care of everything for you ✅\n\n"
      + "🔗 " + link;
  }

  if (step == 3) {
    return "Hey " + name + " 🙏\n"
      + "Just checking in. No pressure at all, I know life can get busy.\n\n"
      + "I just wanted to let you know that the bundles you viewed are still available for now.\n"
      + "Prices sometimes change based on stock levels, so I can't promise they'll stay exactly the same.\n\n"
      + "Most people in your situation go with:\n\n"
      + "🔥 *Self Love Plus B2GOF* ₦66,750\n"
      + "(Buy 2 sets, Get 1 FREE + Pay on Delivery)\n"
      + "📋 *What's inside:* 2 Shampoo + 2 Pomade + 2 Conditioner + FREE 1 of each\n\n"
      + "Whenever you're ready, just drop your Name + Address,\n"
      + "and I'll handle the rest.\n\n"
      + "And if now isn't the right time, absolutely no wahala 💚\n"
      + "Your hair journey matters, and you're always welcome back 🌿\n\n"
      + "🔗 " + link;
  }

  if (step == 4) {
    return "Hey " + name + " 😊\n"
      + "Quick free tip from us 🌿\n\n"
      + "If your edges feel dry or thin, try this tonight:\n"
      + "Apply a small amount of natural oil to your edges before bed,\n"
      + "then wrap with a satin scarf.\n"
      + "Do this every night for 7 days. It really helps reduce breakage.\n\n"
      + "No selling here, just something that actually works ✨\n\n"
      + "Whenever you're ready for the full restoration system,\n"
      + "you know where to find us 💚\n\n"
      + "🔗 " + link;
  }

  return '';
}


// ============================================================================
// 6. COMMITMENT LADDER ENGINE
// ============================================================================

function processCommitmentLadder() {
  var ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  var sheet = ss.getSheetByName(CONFIG.ORDERS_SHEET);
  if (!sheet || sheet.getLastRow() < 2) return;

  var data = sheet.getDataRange().getValues();
  var now = new Date();
  var commitCount = 0;
  var activeStatuses = ['Pending', 'Confirmed', 'Assigned'];

  for (var i = 1; i < data.length; i++) {
    var status = data[i][19];
    var commitStep = parseInt(data[i][35] || 0, 10);
    var createdAt = new Date(data[i][1]);
    var phone = data[i][3];
    var state = data[i][10] || '';

    if (activeStatuses.indexOf(status) === -1 || commitStep >= 4 || !phone) continue;
    if (['Delivered', 'Paid', 'Cancelled', 'RTO'].indexOf(status) !== -1) continue;

    var diffMins = (now - createdAt) / 60000;
    var nextStage = null;
    for (var s = 0; s < COMMITMENT_STAGES.length; s++) {
      if (COMMITMENT_STAGES[s].step === (commitStep + 1)) { nextStage = COMMITMENT_STAGES[s]; break; }
    }

    if (nextStage && diffMins >= nextStage.delay) {
      var customerName = data[i][2];
      var packageName = data[i][6];
      var amount = data[i][9];
      var deliveryFee = data[i][14] || 3000;
      var total = (amount || 0) + deliveryFee;

      var msg = getCommitmentMessage(nextStage.step, packageName, customerName, amount, deliveryFee, total, state);
      var sent = sendWhatsApp(phone, msg);

      if (sent) {
        sheet.getRange(i + 1, 36).setValue(nextStage.step);
        commitCount++;
      }
    }
  }

  if (commitCount > 0) console.log('Commitment Ladder: Sent ' + commitCount + ' messages at ' + now);
}
// ============================================================================
// 7. COMMITMENT LADDER MESSAGES
// ============================================================================

function getCommitmentMessage(step, packageName, customerName, productPrice, deliveryFee, total, state) {
  var name = customerName || 'there';
  var pkg = (packageName && packageName.toLowerCase().indexOf('not selected') === -1) ? packageName : 'Fulani Hair Gro pack';
  var pkgContents = getPackageContents(pkg);

  if (step == 1) {
    return "Hi " + name + " 🌿\n"
      + "While your Fulani Hair Gro order is being prepared, here's your *3-Day Starter Routine* so you're fully ready when it arrives.\n\n"
      + "Save this message ✅\n\n"
      + "🗓️ *DAY 1: RESET & PROTECT*\n"
      + "• Keep your scalp clean and dry\n"
      + "• Avoid tight braids, wigs, or slick styles\n"
      + "• Do not scratch or over-oil your scalp\n"
      + "• Sleep with a satin scarf or bonnet\n\n"
      + "🗓️ *DAY 2: GENTLE STIMULATION*\n"
      + "• Massage edges or thinning areas gently for *60 seconds*\n"
      + "• Avoid heat and harsh chemicals (e.g. relaxers)\n"
      + "• Keep hair in a low-tension style\n\n"
      + "🗓️ *DAY 3: CONSISTENCY*\n"
      + "• Repeat the gentle 60-second massage\n"
      + "• Continue low-tension styling\n"
      + "• Be patient. *density comes before length*\n\n"
      + "You don't need to use any product yet.\n"
      + "Once your package arrives, I'll guide you step-by-step on how to start properly.\n\n"
      + "Your hair journey has already begun 🌿";
  }

  if (step == 2) {
    var pkgInfo = CONFIG.PACKAGES[pkg] || CONFIG.PACKAGES[packageName] || null;
    var hasShampoo = pkgInfo ? pkgInfo.hasShampoo : true;

    var msg = "Hi " + name + " 🌿\n"
      + "Quick note before your Fulani Hair Gro package arrives, just so nothing surprises you.\n\n"
      + "🧴 *About the Pomade*\n"
      + "You may notice small natural particles inside the pomade.\n"
      + "That's *normal and intentional*.\n\n"
      + "Those particles are part of the *active Fulani herbs*.\n"
      + "They're left inside so the herbs can keep *infusing and soaking* into the pomade. This is where much of the hair-growth strength comes from.\n"
      + "Please don't remove or strain them.";

    if (hasShampoo) {
      msg += "\n\n🧼 *About the Shampoo*\n"
        + "Our shampoo is *sulphate-free*, so it won't foam heavily like regular shampoos.\n\n"
        + "Sulphates are cheaper ingredients that create lots of suds,\n"
        + "but they strip natural oils and lead to dry, breaking hair.\n"
        + "Even with low foam, our shampoo *cleans your scalp properly* while protecting moisture.";
    }

    msg += "\n\nSo if it feels different from supermarket products, that's a *good sign* 🌿\n"
      + "Everything is working exactly as designed.";

    return msg;
  }

  if (step == 3) {
    var stateText = state ? " to *" + state + "* alone" : " across Nigeria";
    return "Quick update, " + name + " 😊\n\n"
      + "Just so you know, we've processed and delivered hundreds of orders" + stateText + " this month. "
      + "You're in very good company 🌿\n\n"
      + "A lot of customers tell us the moment they opened the box and smelled the formula, "
      + "they knew it was different from anything they'd tried before.\n\n"
      + "Your *" + pkg + "* is being prepared.\n"
      + "📋 *What's coming:* " + pkgContents + "\n\n"
      + "We'll update you the moment a rider is assigned to your delivery.\n\n"
      + "Almost there! 💚";
  }

  if (step == 4) {
    return "Hi " + name + ", quick heads up 🙏\n\n"
      + "Your *" + pkg + "* is almost ready for dispatch.\n"
      + "📋 *Your pack:* " + pkgContents + "\n\n"
      + "Just a friendly reminder so there are no surprises when your rider arrives:\n\n"
      + "🧾 Product: ₦" + formatMoney(productPrice) + "\n"
      + "🚚 Delivery: ₦" + formatMoney(deliveryFee) + "\n"
      + "✅ *Total to pay: ₦" + formatMoney(total) + "*\n\n"
      + "📌 *Payment goes ONLY into our company account:*\n"
      + "🏦 " + CONFIG.PAYMENT.BANK + "\n"
      + "📛 " + CONFIG.PAYMENT.ACCOUNT_NAME + "\n"
      + "🔢 " + CONFIG.PAYMENT.ACCOUNT_NUMBER + "\n\n"
      + "⚠️ Please do NOT pay any rider directly.\n\n"
      + "Once you've paid, send proof to 📞 " + CONFIG.PAYMENT.PROOF_PHONE + "\n\n"
      + "Looking forward to hearing about your results! 🌿";
  }

  return '';
}


// ============================================================================
// 8. POST-DELIVERY ENGINE
// ============================================================================

function processPostDelivery() {
  var ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  var sheet = ss.getSheetByName(CONFIG.ORDERS_SHEET);
  if (!sheet || sheet.getLastRow() < 2) return;

  var data = sheet.getDataRange().getValues();
  var now = new Date();
  var postCount = 0;

  for (var i = 1; i < data.length; i++) {
    var status = data[i][19];
    var postStep = parseInt(data[i][36] || 0, 10);
    var deliveredAt = data[i][37];
    var phone = data[i][3];

    if ((status !== 'Delivered' && status !== 'Paid') || postStep >= 5 || !phone) continue;
    if (!deliveredAt) continue;

    deliveredAt = new Date(deliveredAt);
    if (isNaN(deliveredAt.getTime())) continue;

    var diffMins = (now - deliveredAt) / 60000;
    var nextStage = null;
    for (var s = 0; s < POST_DELIVERY_STAGES.length; s++) {
      if (POST_DELIVERY_STAGES[s].step === (postStep + 1)) { nextStage = POST_DELIVERY_STAGES[s]; break; }
    }

    if (nextStage && diffMins >= nextStage.delay) {
      var customerName = data[i][2];
      var packageName = data[i][6];
      var msg = getPostDeliveryMessage(nextStage.step, packageName, customerName);
      var sent = sendWhatsApp(phone, msg);
      if (sent) {
        sheet.getRange(i + 1, 37).setValue(nextStage.step);
        postCount++;
      }
    }
  }

  if (postCount > 0) console.log('Post-Delivery: Sent ' + postCount + ' messages at ' + now);
}


// ============================================================================
// 9. POST-DELIVERY MESSAGES (5-Stage Guided Journey)
// ============================================================================

function getPostDeliveryMessage(step, packageName, customerName) {
  var name = customerName || 'there';
  var pkg = (packageName && packageName.toLowerCase().indexOf('not selected') === -1) ? packageName : 'Fulani Hair Gro pack';
  var pkgContents = getPackageContents(pkg);

  if (step == 1) {
    return "Hi " + name + " 🌿\n"
      + "Now that your products are with you, here's how to start *today*.\n\n"
      + "📦 *Your pack:* " + pkgContents + "\n\n"
      + "📌 Please don't rush or mix products yet.\n\n"
      + "👉 *Today (Day 1):*\n"
      + "• Do NOT wash immediately if your scalp feels fine\n"
      + "• Just inspect the products and keep them in a cool place\n"
      + "• Continue gentle scalp massage tonight (60 seconds)\n"
      + "• Sleep with a satin scarf or bonnet\n\n"
      + "Tomorrow, I'll send you the *exact order of use*. What to use first, how much, and when.\n\n"
      + "We focus on doing this *correctly*, not quickly 💚";
  }

  if (step == 2) {
    return "Good morning " + name + " ☀️\n"
      + "Today we officially begin your Fulani Hair Gro routine 🌿\n\n"
      + "📦 *Your pack:* " + pkgContents + "\n\n"
      + "📌 *Day 2: First Proper Use*\n"
      + "Follow this exact order:\n\n"
      + "🧼 *Step 1: Shampoo (The Reset)*\n"
      + "Wet your hair, apply a small amount of shampoo and wash gently. *Do not scratch* your scalp.\n"
      + "The shampoo deep-cleanses your scalp and opens the follicles so the other products can absorb properly. "
      + "This is the reset button for your hair journey.\n"
      + "You may notice the lather feels different from regular shampoo. That's because it's herb-based, not chemical-based. "
      + "It won't foam the same way, and that's perfectly fine. It's working at the scalp level, not just the surface.\n\n"
      + "💧 *Step 2: Conditioner (The Protector)*\n"
      + "After rinsing the shampoo, apply conditioner and let it sit for 2 to 3 minutes before rinsing.\n"
      + "The conditioner locks in moisture and strengthens any new growth so it doesn't break off. "
      + "This is what protects the progress the other products create.\n"
      + "Don't skip this step. It makes a bigger difference than most people expect.\n\n"
      + "🧴 *Step 3: Pomade / Hair Cream (The Growth Engine)*\n"
      + "Apply a small amount of pomade to your edges, thinning areas, or bald spots.\n"
      + "Massage gently for 60 seconds. Just light pressure, nothing aggressive.\n"
      + "The pomade feeds the follicle directly with the 400-year Fulani herbal formula. "
      + "This is where the actual growth happens.\n\n"
      + "🌿 *Important note about the Pomade:*\n"
      + "You may notice small natural particles inside. This is *normal and intentional*.\n"
      + "Those particles are the *active Fulani herbs* used in the formulation. "
      + "They are not dirt and should *not* be removed or strained out.\n"
      + "They stay inside the pomade so the herbal actives can *continue soaking and infusing*. "
      + "That's where much of the hair-growth power comes from.\n"
      + "Think of them as the super-powered herbs that keep feeding the pomade over time 🌱\n\n"
      + "📍 *Final notes:*\n"
      + "• No tight styling today\n"
      + "• Less is more. Consistency beats excess\n"
      + "• Sleep with a satin scarf or bonnet tonight\n\n"
      + "Just scoop, apply, and follow the order above. Everything is working exactly as designed ✅";
  }

  if (step == 3) {
    return "Hey " + name + " 😊\n"
      + "Just checking in. How's everything going so far?\n\n"
      + "By now you should have used the products at least once or twice.\n\n"
      + "Here's what's normal at this stage:\n"
      + "• Your scalp may feel slightly tingly. That's the herbs working\n"
      + "• You might notice your scalp feels cleaner and less oily\n"
      + "• No visible growth yet, and that's *completely normal*\n\n"
      + "The follicles are waking up underneath. What's happening now is happening at the *root level*. "
      + "You won't see it yet, but it's started.\n\n"
      + "📌 *Your routine this week:*\n"
      + "• Wash with Shampoo 2x this week\n"
      + "• Apply Pomade to edges/thinning areas daily\n"
      + "• Conditioner after each wash\n"
      + "• Keep massaging gently (60 seconds)\n"
      + "• Satin scarf every night\n\n"
      + "If anything feels off or you have questions, just reply here. I'm with you throughout 💚";
  }

  if (step == 4) {
    return "Hi " + name + " 🌿\n"
      + "It's been about a week. Well done for staying consistent 👏\n\n"
      + "I want to be real with you:\n"
      + "Most people expect dramatic results by now. And if you're not seeing big changes yet, that's *exactly where you should be*.\n\n"
      + "Here's what's actually happening:\n"
      + "• The shampoo has been clearing buildup from your scalp\n"
      + "• The pomade herbs have been penetrating the follicle\n"
      + "• The conditioner has been protecting whatever new growth starts\n\n"
      + "The first thing you'll notice won't be length, it'll be *density*.\n"
      + "Tiny baby hairs. Thicker texture. Less shedding.\n\n"
      + "That's the Fulani formula doing its work underneath 🌱\n\n"
      + "📌 *Keep going exactly as you are:*\n"
      + "Wash 2x/week → Pomade daily → Conditioner after wash → Satin scarf at night\n\n"
      + "The women who see the best results are the ones who didn't quit at week one.\n"
      + "You're already past that point 💚";
  }

  if (step == 5) {
    return "Hey " + name + " 🌿\n"
      + "It's been about 3 weeks. Let's talk about where you are now.\n\n"
      + "By this point, most consistent users notice:\n"
      + "• Baby hairs appearing along the edges\n"
      + "• Scalp feels healthier and less irritated\n"
      + "• Less breakage when styling\n"
      + "• Hair texture feels thicker at the roots\n\n"
      + "If you're seeing *any* of this, your follicles are responding. The formula is working.\n\n"
      + "If you're not seeing it yet, don't worry. Everyone's scalp heals at its own pace. "
      + "The key is not stopping now.\n\n"
      + "📌 *What happens next:*\n"
      + "The 90-day mark is where the real transformation shows. "
      + "That's when the follicle cycle fully resets and new growth becomes visible to everyone around you.\n\n"
      + "Most of our customers reorder around now to keep the cycle going without a gap.\n\n"
      + "📦 *Your original pack was:* " + pkgContents + "\n"
      + "Just reply here and I'll lock in a restock for you right away 💚\n\n"
      + "Either way, I'm proud of your consistency. Keep going 🌱";
  }

  return '';
}


// ============================================================================
// 10. STATUS NOTIFICATION ENGINE
// ============================================================================

function buildOrderData(sheet, rowNum, extraData) {
  var row = sheet.getRange(rowNum, 1, 1, 38).getValues()[0];
  var productPrice = row[9] || 0;
  var deliveryFee = row[14] || 3000;
  var total = productPrice + deliveryFee;
  var deliveryType = (deliveryFee >= 5000) ? '⚡ Same-Day Delivery' : '🕒 24–48 Hours Delivery';

  var packageName = row[6] || '';
  var badNames = ['', 'not selected yet', 'not selected', 'undefined', 'null', 'none'];
  if (badNames.indexOf(packageName.toString().toLowerCase().trim()) !== -1) {
    packageName = '⚠️ Package not selected';
  }

  var priceDisplay = formatMoney(productPrice);
  var totalDisplay = formatMoney(total);
  if (productPrice === 0) {
    priceDisplay = '⚠️ 0 (needs update)';
    totalDisplay = '⚠️ ' + formatMoney(deliveryFee) + ' (product missing)';
  }

  var daName = (extraData && extraData.daName) || row[21] || '';
  var daPhone = (extraData && extraData.daPhone) || row[22] || '';
  if (daName && !daPhone) daPhone = getDAPhone(daName);

  return {
    orderId: row[0],
    customerName: row[2] || 'Customer',
    phone: row[3],
    email: row[4],
    packageName: packageName,
    packageContents: getPackageContents(packageName),
    productPrice: priceDisplay,
    deliveryFee: formatMoney(deliveryFee),
    total: totalDisplay,
    deliveryType: deliveryType,
    state: row[10] || '',
    lga: row[11] || '',
    address: row[12] || '',
    landmark: row[13] || '',
    fullAddress: [row[12], row[11], row[10]].filter(function(x) { return x; }).join(', '),
    daName: daName,
    daPhone: daPhone,
    salesName: row[20] || '',
    salesPhone: row[33] || '',
    note: (extraData && extraData.note) || '',
    status: row[19] || ''
  };
}

function formatMoney(num) {
  return Number(num).toLocaleString('en-NG');
}

function getPackageContents(pkgName) {
  var contents = {
    'SELF LOVE PLUS': '1 Shampoo + 1 Pomade + 1 Conditioner',
    'SELF LOVE RETURN': '3 Pomades',
    'SELF LOVE B2GOF': '2 Shampoo + 2 Pomade + FREE 1 Shampoo + 1 Pomade',
    'SELF LOVE PLUS B2GOF': '2 Shampoo + 2 Pomade + 2 Conditioner + FREE 1 of each',
    'FAMILY SAVES': '6 Shampoo + 6 Pomade + 6 Conditioner + FREE 4 of each'
  };
  return contents[pkgName] || pkgName;
}


function sendStatusNotifications(status, d) {

  var customerMsg = '';

  if (status === 'Pending') {
    var hasProduct = d.productPrice.indexOf('⚠️') === -1 && d.productPrice !== '0';
    if (hasProduct) {
      customerMsg = "🎉 *ORDER RECEIVED* Fulani Hair Gro\n\n"
        + "Hi " + d.customerName + " 👋\nThank you for your order 💚\n\n"
        + "🧾 Order ID: " + d.orderId + "\n"
        + "📦 Package: " + d.packageName + "\n"
        + "📋 *You will receive:*\n" + d.packageContents + "\n\n"
        + "🚚 Delivery: " + d.deliveryType + "\n\n"
        + "🧾 Product Price: ₦" + d.productPrice + "\n"
        + "🚚 Delivery Fee: ₦" + d.deliveryFee + "\n"
        + "✅ Total Payable: ₦" + d.total + "\n\n"
        + "Payment: Pay on Delivery (Company Account Only)\n\n"
        + "We'll contact you shortly to confirm your details.\n💚 Fulani Hair Gro";
    } else {
      customerMsg = "🎉 *ORDER RECEIVED* Fulani Hair Gro\n\n"
        + "Hi " + d.customerName + " 👋\nThank you for starting your order 💚\n\n"
        + "🧾 Order ID: " + d.orderId + "\n\n"
        + "We'll contact you shortly on WhatsApp to confirm your package and delivery details.\n\n"
        + "💚 Fulani Hair Gro";
    }
  }

  if (status === 'Confirmed') {
    customerMsg = "✅ *ORDER CONFIRMED* Fulani Hair Gro\n\n"
      + "Hi " + d.customerName + " 🎉\nYour order has been confirmed.\n\n"
      + "🧾 Order ID: " + d.orderId + "\n"
      + "📦 Package: " + d.packageName + "\n"
      + "📋 *You will receive:*\n" + d.packageContents + "\n\n"
      + "🚚 Delivery: " + d.deliveryType + "\n\n"
      + "🧾 Product Price: ₦" + d.productPrice + "\n"
      + "🚚 Delivery Fee: ₦" + d.deliveryFee + "\n"
      + "✅ Total Payable: ₦" + d.total + "\n\n"
      + "📌 *PAYMENT INSTRUCTION*\n"
      + "Please pay ONLY into our official company account when delivery arrives.\n\n"
      + "🏦 Bank: " + CONFIG.PAYMENT.BANK + "\n"
      + "📛 Account Name: " + CONFIG.PAYMENT.ACCOUNT_NAME + "\n"
      + "🔢 Account Number: " + CONFIG.PAYMENT.ACCOUNT_NUMBER + "\n\n"
      + "⚠️ Delivery agents are NOT allowed to collect money.\n\n"
      + "We'll notify you once a rider is assigned.\n💚 Fulani Hair Gro";
  }

  if (status === 'Assigned') {
    customerMsg = "📦 *DELIVERY ASSIGNED* Fulani Hair Gro\n\n"
      + "Hi " + d.customerName + " 😊\nYour order has been assigned.\n\n"
      + "🧾 Order ID: " + d.orderId + "\n"
      + "📦 Package: " + d.packageName + "\n"
      + "📋 *You will receive:*\n" + d.packageContents + "\n\n"
      + "🚚 Delivery: " + d.deliveryType + "\n"
      + "🚴 Rider: " + d.daName + "\n"
      + "📞 Rider Phone: " + d.daPhone + "\n\n"
      + "🧾 Product Price: ₦" + d.productPrice + "\n"
      + "🚚 Delivery Fee: ₦" + d.deliveryFee + "\n"
      + "✅ Total Payable: ₦" + d.total + "\n\n"
      + "📌 Reminder: Payment goes ONLY to Fulani Hair Gro company account.\n"
      + "Please stay reachable for smooth delivery 📞";
  }

  if (status === 'Out for Delivery') {
    customerMsg = "🚚 *OUT FOR DELIVERY* Fulani Hair Gro\n\n"
      + "Hi " + d.customerName + " 🎉\nYour order is on the way.\n\n"
      + "🧾 Order ID: " + d.orderId + "\n"
      + "📦 Package: " + d.packageName + "\n"
      + "📋 *You will receive:*\n" + d.packageContents + "\n\n"
      + "🚚 Delivery: " + d.deliveryType + "\n"
      + "🚴 Rider: " + d.daName + "\n\n"
      + "🧾 Product Price: ₦" + d.productPrice + "\n"
      + "🚚 Delivery Fee: ₦" + d.deliveryFee + "\n"
      + "✅ Amount to Pay: ₦" + d.total + "\n\n"
      + "📌 *PAYMENT RULE*\n"
      + "Pay ONLY into Fulani Hair Gro company account:\n"
      + "🏦 " + CONFIG.PAYMENT.BANK + " " + CONFIG.PAYMENT.ACCOUNT_NAME + "\n"
      + "🔢 " + CONFIG.PAYMENT.ACCOUNT_NUMBER + "\n\n"
      + "⚠️ Do NOT pay any rider directly.\n\n"
      + "After payment, send proof to:\n📞 " + CONFIG.PAYMENT.PROOF_PHONE;
  }

  if (status === 'Delivered') {
    customerMsg = "✅ *DELIVERED* Fulani Hair Gro\n\n"
      + "Hi " + d.customerName + " 💚\nYour order has been delivered successfully.\n\n"
      + "🧾 Order ID: " + d.orderId + "\n"
      + "📦 Package: " + d.packageName + "\n"
      + "📋 *You received:*\n" + d.packageContents + "\n\n"
      + "If you need help with usage or routine, reply \"ROUTINE\".\n"
      + "Thank you for choosing Fulani Hair Gro 🌿";
  }

  if (status === 'Paid') {
    customerMsg = "💰 *PAYMENT CONFIRMED* THANK YOU\n\n"
      + "Hi " + d.customerName + " 🙏\nWe've confirmed your payment successfully.\n\n"
      + "🧾 Order ID: " + d.orderId + "\n"
      + "📦 Package: " + d.packageName + "\n"
      + "📋 " + d.packageContents + "\n\n"
      + "🧾 Product Price: ₦" + d.productPrice + "\n"
      + "🚚 Delivery Fee: ₦" + d.deliveryFee + "\n"
      + "✅ Total Paid: ₦" + d.total + "\n\n"
      + "Welcome to your hair recovery journey 🌿\n"
      + "Reply \"GUIDE\" to receive your 7-day routine.";
  }

  if (status === 'Rescheduled') {
    customerMsg = "📅 *DELIVERY RESCHEDULED* Fulani Hair Gro\n\n"
      + "Hi " + d.customerName + " ✅\nWe've rescheduled your delivery as requested.\n\n"
      + "🧾 Order ID: " + d.orderId + "\n"
      + "📦 Package: " + d.packageName + "\n"
      + "📋 " + d.packageContents + "\n\n"
      + "📌 Note: " + d.note + "\n\n"
      + "🧾 Product Price: ₦" + d.productPrice + "\n"
      + "🚚 Delivery Fee: ₦" + d.deliveryFee + "\n"
      + "✅ Total: ₦" + d.total + "\n\n"
      + "We'll reach out again before the next attempt 🙏";
  }

  if (status === 'Cancelled') {
    customerMsg = "❌ *ORDER CANCELLED* Fulani Hair Gro\n\n"
      + "Hi " + d.customerName + ", your order has been cancelled.\n\n"
      + "🧾 Order ID: " + d.orderId + "\n"
      + "📦 Package: " + d.packageName + "\n"
      + "📋 " + d.packageContents + "\n\n"
      + "🧾 Product Price: ₦" + d.productPrice + "\n"
      + "🚚 Delivery Fee: ₦" + d.deliveryFee + "\n"
      + "✅ Total: ₦" + d.total + "\n\n"
      + "If you cancelled by mistake, reply \"REOPEN\" and we'll assist you.";
  }

  if (status === 'RTO') {
    customerMsg = "🔄 *DELIVERY RETURNED* Fulani Hair Gro\n\n"
      + "Hi " + d.customerName + " 🙏\nWe couldn't complete delivery and the package is being returned.\n\n"
      + "🧾 Order ID: " + d.orderId + "\n"
      + "📦 Package: " + d.packageName + "\n"
      + "📋 " + d.packageContents + "\n\n"
      + "📌 Reason: " + d.note + "\n\n"
      + "🧾 Product Price: ₦" + d.productPrice + "\n"
      + "🚚 Delivery Fee: ₦" + d.deliveryFee + "\n"
      + "✅ Total: ₦" + d.total + "\n\n"
      + "If you still want it, reply \"REDELIVER\" with your correct address/landmark.";
  }

  if (customerMsg && d.phone) sendWhatsApp(d.phone, customerMsg);

  var daMsg = '';

  if (status === 'Assigned' && d.daPhone) {
    daMsg = "🚴 *DELIVERY ASSIGNMENT* Order " + d.orderId + "\n\n"
      + "Customer: " + d.customerName + "\n"
      + "Phone: " + d.phone + "\n"
      + "Address: " + d.address + ", " + d.state + "\n"
      + "Delivery: " + d.deliveryType + "\n\n"
      + "📦 Package: " + d.packageName + "\n"
      + "📋 *Items to pack:* " + d.packageContents + "\n\n"
      + "🧾 Product: ₦" + d.productPrice + "\n"
      + "🚚 Delivery Fee: ₦" + d.deliveryFee + "\n"
      + "✅ Total: ₦" + d.total + "\n\n"
      + "📌 *YOUR JOB:*\n"
      + "1️⃣ Deliver the package\n"
      + "2️⃣ Customer pays Fulani Hair Gro directly:\n"
      + "   🏦 Moniepoint " + CONFIG.PAYMENT.ACCOUNT_NUMBER + "\n"
      + "3️⃣ Collect proof of payment from customer\n"
      + "4️⃣ Confirm we have received payment BEFORE you leave the customer\n\n"
      + "⚠️ Do NOT leave until payment is confirmed.";
  }

  if (status === 'Delivered' && d.daPhone) {
    daMsg = "✅ *DELIVERY CONFIRMATION REQUIRED*\n\n"
      + "Order: " + d.orderId + "\n"
      + "Customer: " + d.customerName + "\n"
      + "📦 Package: " + d.packageName + "\n"
      + "📋 " + d.packageContents + "\n\n"
      + "🧾 Total: ₦" + d.total + "\n\n"
      + "Confirm delivery ONLY.\nDo NOT mark PAID.";
  }

  if (status === 'Paid' && d.daPhone) {
    daMsg = "💰 *PAYMENT CONFIRMED*\n\n"
      + "Order: " + d.orderId + "\n"
      + "Customer: " + d.customerName + " (" + d.phone + ")\n"
      + "📦 Package: " + d.packageName + "\n"
      + "📋 " + d.packageContents + "\n\n"
      + "✅ Total Paid: ₦" + d.total + "\n\n"
      + "Payment has been confirmed by Fulani Hair Gro.\n"
      + "You can close out this delivery.";
  }

  if ((status === 'Rescheduled' || status === 'Cancelled' || status === 'RTO') && d.daPhone) {
    daMsg = "⚠️ *ACTION REQUIRED* Order " + d.orderId + " set to " + status + "\n\n"
      + "Customer: " + d.customerName + " (" + d.phone + ")\n"
      + "📦 Package: " + d.packageName + "\n"
      + "📋 " + d.packageContents + "\n\n"
      + "🧾 Total: ₦" + d.total + " (Product ₦" + d.productPrice + " + Delivery ₦" + d.deliveryFee + ")\n"
      + "Reason/Note: " + d.note + "\n\n"
      + "Follow logistics instruction immediately.";
  }

  if (daMsg && d.daPhone) sendWhatsApp(d.daPhone, daMsg);

  var salesMsg = '';

  if (status === 'Pending' && d.salesPhone) {
    salesMsg = "🔔🔔🔔 *NEW ORDER: NEEDS CONFIRMATION* 🔔🔔🔔\n\n"
      + "*Order " + d.orderId + "*\n\n"
      + "👤 *" + d.customerName + "*\n"
      + "📞 " + d.phone + "\n\n"
      + "📦 *Products:*\n"
      + d.packageContents + "\n\n"
      + "🧾 Product: ₦" + d.productPrice + "\n"
      + "🚚 Delivery: ₦" + d.deliveryFee + "\n"
      + "✅ Total: ₦" + d.total + "\n\n"
      + "📍" + d.fullAddress + "\n\n"
      + "Delivery: " + d.deliveryType + "\n\n"
      + "Call customer, confirm, update status.\n\n"
      + "💚 Fulani Hair Gro";
  }

  if (status === 'Confirmed' && d.salesPhone) {
    salesMsg = "✅ *CONFIRMED* Order " + d.orderId + "\n\n"
      + "Customer: " + d.customerName + " (" + d.phone + ")\n"
      + "📦 Package: " + d.packageName + "\n"
      + "📋 " + d.packageContents + "\n\n"
      + "🧾 Product: ₦" + d.productPrice + "\n"
      + "🚚 Delivery: ₦" + d.deliveryFee + "\n"
      + "✅ Total: ₦" + d.total + "\n\n"
      + "Next: assign DA.";
  }

  if ((status === 'Rescheduled' || status === 'Cancelled' || status === 'RTO') && d.salesPhone) {
    salesMsg = "⚠️ *FOLLOW-UP REQUIRED* Order " + d.orderId + " is " + status + "\n\n"
      + "Customer: " + d.customerName + " (" + d.phone + ")\n"
      + "📦 Package: " + d.packageName + "\n"
      + "📋 " + d.packageContents + "\n\n"
      + "🧾 Total: ₦" + d.total + " (Product ₦" + d.productPrice + " + Delivery ₦" + d.deliveryFee + ")\n"
      + "Reason/Note: " + d.note + "\n\n"
      + "Call customer + attempt save / fix address / reschedule.";
  }

  if (salesMsg && d.salesPhone) sendWhatsApp(d.salesPhone, salesMsg);

  var ownerMsg = '';

  if (status === 'Pending') {
    ownerMsg = "🔔🔔🔔 *NEW ORDER!* 🔔🔔🔔\n\n"
      + "*Order " + d.orderId + "*\n\n"
      + "👤 *" + d.customerName + "*\n"
      + "📞 " + d.phone + "\n\n"
      + "📦 *Products:*\n"
      + d.packageContents + "\n\n"
      + "🧾 Product: ₦" + d.productPrice + "\n"
      + "🚚 Delivery: ₦" + d.deliveryFee + "\n"
      + "✅ Total: ₦" + d.total + "\n\n"
      + "📍" + d.fullAddress + "\n\n"
      + "Delivery: " + d.deliveryType + "\n\n"
      + "💚 Fulani Hair Gro";
  }

  if (status === 'Confirmed') {
    ownerMsg = "✅✅✅ *ORDER CONFIRMED!* ✅✅✅\n\n"
      + "*Order " + d.orderId + "*\n\n"
      + "👤 *" + d.customerName + "*\n"
      + "📞 " + d.phone + "\n\n"
      + "📦 *Products:*\n"
      + d.packageContents + "\n\n"
      + "🧾 Product: ₦" + d.productPrice + "\n"
      + "🚚 Delivery: ₦" + d.deliveryFee + "\n"
      + "✅ Total: ₦" + d.total + "\n\n"
      + "📍" + d.fullAddress + "\n\n"
      + "Sales: " + d.salesName + "\n"
      + "Delivery: " + d.deliveryType + "\n\n"
      + "💚 Fulani Hair Gro";
  }

  if (status === 'Assigned') {
    ownerMsg = "🚴 *DA ASSIGNED* Order " + d.orderId + "\n\n"
      + "👤 *" + d.customerName + "*\n"
      + "📞 " + d.phone + "\n\n"
      + "📦 " + d.packageContents + "\n"
      + "✅ Total: ₦" + d.total + "\n\n"
      + "📍" + d.fullAddress + "\n\n"
      + "DA: " + d.daName + "\n"
      + "Sales: " + d.salesName + "\n\n"
      + "💚 Fulani Hair Gro";
  }

  if (status === 'Paid') {
    ownerMsg = "💰💰💰 *PAYMENT RECEIVED!* 💰💰💰\n\n"
      + "*Order " + d.orderId + "*\n\n"
      + "👤 *" + d.customerName + "*\n"
      + "📞 " + d.phone + "\n\n"
      + "📦 " + d.packageContents + "\n\n"
      + "🧾 Product: ₦" + d.productPrice + "\n"
      + "🚚 Delivery: ₦" + d.deliveryFee + "\n"
      + "✅ Total Received: ₦" + d.total + "\n\n"
      + "Sales: " + d.salesName + "\n"
      + "DA: " + d.daName + "\n\n"
      + "💚 Fulani Hair Gro";
  }

  if (status === 'Cancelled' || status === 'RTO') {
    ownerMsg = "🚨🚨🚨 *" + status.toUpperCase() + " ALERT!* 🚨🚨🚨\n\n"
      + "*Order " + d.orderId + "*\n\n"
      + "👤 *" + d.customerName + "*\n"
      + "📞 " + d.phone + "\n\n"
      + "📦 " + d.packageContents + "\n\n"
      + "🧾 Total at risk: ₦" + d.total + "\n\n"
      + "Sales: " + d.salesName + "\n"
      + "DA: " + d.daName + "\n"
      + "Reason: " + d.note + "\n\n"
      + "💚 Fulani Hair Gro";
  }

  if (ownerMsg) sendWhatsApp(CONFIG.TEAM.OWNER, ownerMsg);
}


// ============================================================================
// 11. STATUS CHANGE HANDLER
// ============================================================================

function changeOrderStatus(rowNum, newStatus, extras) {
  var ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  var sheet = ss.getSheetByName(CONFIG.ORDERS_SHEET);
  extras = extras || {};
  sheet.getRange(rowNum, 20).setValue(newStatus);
  if (newStatus === 'Delivered') {
    sheet.getRange(rowNum, 38).setValue(new Date());
  }
  var orderData = buildOrderData(sheet, rowNum, extras);
  orderData.status = newStatus;
  sendStatusNotifications(newStatus, orderData);
}


function onEdit(e) {
  var sheet = e.source.getActiveSheet();
  if (sheet.getName() !== CONFIG.ORDERS_SHEET) return;

  var col = e.range.getColumn();
  var row = e.range.getRow();
  if (row < 2) return;

  if (col === 20) {
    var newStatus = e.value;
    if (CONFIG.STATUSES.indexOf(newStatus) !== -1) {
      if (newStatus === 'Delivered') {
        sheet.getRange(row, 38).setValue(new Date());
      }
      var orderData = buildOrderData(sheet, row, {});
      orderData.status = newStatus;
      sendStatusNotifications(newStatus, orderData);
    }
  }

  if (col === 22 && e.value) {
    var daName = e.value;
    var daPhone = getDAPhone(daName);

    if (daPhone) {
      sheet.getRange(row, 23).setValue(formatPhoneForDisplay(daPhone));
    }

    var currentStatus = sheet.getRange(row, 20).getValue();
    if (currentStatus === 'Pending' || currentStatus === 'Confirmed') {
      sheet.getRange(row, 20).setValue('Assigned');
    }

    var orderData2 = buildOrderData(sheet, row, { daName: daName, daPhone: daPhone });
    orderData2.status = 'Assigned';

    if (daPhone) {
      var daMsg = "🚴 *DELIVERY ASSIGNMENT* Order " + orderData2.orderId + "\n\n"
        + "Customer: " + orderData2.customerName + "\n"
        + "Phone: " + orderData2.phone + "\n"
        + "Address: " + orderData2.address + ", " + orderData2.state + "\n"
        + "Landmark: " + orderData2.landmark + "\n"
        + "Delivery: " + orderData2.deliveryType + "\n\n"
        + "📦 Package: " + orderData2.packageName + "\n"
        + "📋 *Items to pack:* " + orderData2.packageContents + "\n\n"
        + "🧾 Product: ₦" + orderData2.productPrice + "\n"
        + "🚚 Delivery Fee: ₦" + orderData2.deliveryFee + "\n"
        + "✅ Total: ₦" + orderData2.total + "\n\n"
        + "📌 *YOUR JOB:*\n"
        + "1️⃣ Deliver the package\n"
        + "2️⃣ Customer pays Fulani Hair Gro directly:\n"
        + "   🏦 Moniepoint " + CONFIG.PAYMENT.ACCOUNT_NUMBER + "\n"
        + "3️⃣ Collect proof of payment from customer\n"
        + "4️⃣ Confirm we have received payment BEFORE you leave the customer\n\n"
        + "⚠️ Do NOT leave until payment is confirmed.";
      sendWhatsApp(daPhone, daMsg);
    }

    if (orderData2.phone) {
      var custMsg = "📦 *DELIVERY ASSIGNED* Fulani Hair Gro\n\n"
        + "Hi " + orderData2.customerName + " 😊\nYour order has been assigned.\n\n"
        + "🧾 Order ID: " + orderData2.orderId + "\n"
        + "🚚 Delivery: " + orderData2.deliveryType + "\n"
        + "🚴 Rider: " + daName + "\n"
        + "📞 Rider Phone: " + formatPhoneForDisplay(daPhone) + "\n\n"
        + "🧾 Product Price: ₦" + orderData2.productPrice + "\n"
        + "🚚 Delivery Fee: ₦" + orderData2.deliveryFee + "\n"
        + "✅ Total Payable: ₦" + orderData2.total + "\n\n"
        + "📌 *PAYMENT INSTRUCTION*\n"
        + "Pay ONLY into our company account:\n"
        + "🏦 " + CONFIG.PAYMENT.BANK + " " + CONFIG.PAYMENT.ACCOUNT_NAME + "\n"
        + "🔢 " + CONFIG.PAYMENT.ACCOUNT_NUMBER + "\n\n"
        + "⚠️ Do NOT pay any rider directly.\n"
        + "After payment, send proof to: 📞 " + CONFIG.PAYMENT.PROOF_PHONE;
      sendWhatsApp(orderData2.phone, custMsg);
    }

    var ownerMsg = "🚚 *DA ASSIGNED* " + orderData2.orderId + "\n\n"
      + "Customer: " + orderData2.customerName + " (" + orderData2.phone + ")\n"
      + "📦 Package: " + orderData2.packageName + "\n"
      + "📋 " + orderData2.packageContents + "\n"
      + "State: " + orderData2.state + "\n"
      + "🚴 DA: " + daName + " (" + formatPhoneForDisplay(daPhone) + ")\n\n"
      + "🧾 Product: ₦" + orderData2.productPrice + "\n"
      + "🚚 Delivery: ₦" + orderData2.deliveryFee + "\n"
      + "✅ Total: ₦" + orderData2.total;
    sendWhatsApp(CONFIG.TEAM.OWNER, ownerMsg);
    sendWhatsApp(CONFIG.TEAM.LOGISTICS, ownerMsg);

    console.log('DA Assigned: ' + daName + ' → Order ' + orderData2.orderId);
  }
}
// ============================================================================
// 12. WHATSAPP DELIVERY (eBulkSMS API)
// ============================================================================

function sendWhatsApp(phone, message) {
  if (!phone || !message) return false;
  var normalizedPhone = normalizePhone(phone);
  if (!normalizedPhone) return false;

  var payload = {
    "WA": {
      "auth": { "username": CONFIG.EBULKSMS_USERNAME, "apikey": CONFIG.EBULKSMS_API_KEY },
      "message": { "subject": "Fulani Hair Gro", "messagetext": message },
      "recipients": [normalizedPhone]
    }
  };

  try {
    var response = UrlFetchApp.fetch('https://api.ebulksms.com/sendwhatsapp.json', {
      method: 'post', contentType: 'application/json',
      payload: JSON.stringify(payload), muteHttpExceptions: true
    });
    var code = response.getResponseCode();
    return (code >= 200 && code < 300);
  } catch (e) {
    console.error('WhatsApp Error: ' + e.message);
    return false;
  }
}

function sendWhatsAppImage(phone, imageUrl, caption) {
  if (!phone || !imageUrl) return false;
  var normalizedPhone = normalizePhone(phone);
  if (!normalizedPhone) return false;

  var payload = {
    "WA": {
      "auth": { "username": CONFIG.EBULKSMS_USERNAME, "apikey": CONFIG.EBULKSMS_API_KEY },
      "message": { "messagetext": caption || "", "mediaurl": imageUrl },
      "recipients": [normalizedPhone]
    }
  };

  try {
    var response = UrlFetchApp.fetch('https://api.ebulksms.com/sendwhatsapp.json', {
      method: 'post', contentType: 'application/json',
      payload: JSON.stringify(payload), muteHttpExceptions: true
    });
    var code = response.getResponseCode();
    var body = response.getContentText();
    console.log('WhatsApp Image API: ' + code + ' — ' + body);
    if (code >= 200 && code < 300) return true;
    console.error('WhatsApp Image failed: ' + code + ' — skipping (no URL fallback)');
    return false;
  } catch (e) {
    console.error('WhatsApp Image Error: ' + e.message + ' — skipping (no URL fallback)');
    return false;
  }
}


// ============================================================================
// 13. CORE UTILITIES
// ============================================================================

function safeAlert(msg) {
  try {
    SpreadsheetApp.getUi().alert(msg);
  } catch (e) {
    console.log(msg);
  }
}

function normalizePhone(phone) {
  if (!phone) return '';
  phone = phone.toString().replace(/\D/g, '');
  if (phone.startsWith('234') && phone.length >= 13) return phone;
  if (phone.startsWith('0') && phone.length === 11) return '234' + phone.substring(1);
  if (phone.length === 10) return '234' + phone;
  return phone;
}

function fillTemplate(template, data) {
  for (var key in data) {
    template = template.replace(new RegExp('{' + key + '}', 'g'), data[key]);
  }
  return template;
}


// ============================================================================
// 14. UI MENU & MANUAL CONTROLS
// ============================================================================

function onOpen() {
  SpreadsheetApp.getUi().createMenu('🔱 WHALE OPS v16.1')
    .addItem('▶️ Run All Engines', 'processCartRecovery')
    .addSeparator()
    .addItem('▶️ Recovery Only', 'runRecoveryOnly')
    .addItem('▶️ Commitment Ladder Only', 'processCommitmentLadder')
    .addItem('▶️ Post-Delivery Only', 'processPostDelivery')
    .addSeparator()
    .addItem('📊 Refresh Dashboard', 'refreshDashboard')
    .addItem('📊 Quick Stats (Alert)', 'showRecoveryStats')
    .addItem('🔄 Reset Telesales Rotation', 'resetTelesalesRotation')
    .addItem('🧪 Test Stage 2 Images', 'testStage2Images')
    .addSeparator()
    .addItem('🛠️ Setup Sheets', 'setupSheets')
    .addItem('🔄 Apply Dropdowns', 'applyOrderDropdowns')
    .addItem('⚙️ Setup Triggers', 'setupTriggers')
    .addToUi();
}

function showRecoveryStats() {
  var ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  var sheet = ss.getSheetByName(CONFIG.ORDERS_SHEET);
  if (!sheet || sheet.getLastRow() < 2) { safeAlert('No data yet.'); return; }

  var data = sheet.getDataRange().getValues();
  var stats = { total: 0, partial: 0, pending: 0, confirmed: 0, delivered: 0, paid: 0,
    stage1: 0, stage2: 0, stage3: 0, stage4: 0, whales: 0, miniWhales: 0, recovered: 0, cancelled: 0, rto: 0,
    commit1: 0, commit2: 0, commit3: 0, commit4: 0,
    post1: 0, post2: 0, post3: 0, post4: 0, post5: 0 };

  for (var i = 1; i < data.length; i++) {
    stats.total++;
    var status = data[i][19];
    var step = parseInt(data[i][34] || 0, 10);
    var commitStep = parseInt(data[i][35] || 0, 10);
    var postStep = parseInt(data[i][36] || 0, 10);
    var amount = data[i][9] || 0;

    if (status === 'Partial') {
      stats.partial++;
      if (step>=1) stats.stage1++;
      if (step>=2) stats.stage2++;
      if (step>=3) stats.stage3++;
      if (step>=4) stats.stage4++;
    }
    if (status === 'Pending') { stats.pending++; if (step > 0 && step < 99) stats.recovered++; }
    if (status === 'Confirmed') stats.confirmed++;
    if (status === 'Delivered') stats.delivered++;
    if (status === 'Paid') { stats.paid++; if (step > 0 && step < 99) stats.recovered++; }
    if (status === 'Cancelled') stats.cancelled++;
    if (status === 'RTO') stats.rto++;
    if (amount >= CONFIG.WHALE_AMOUNT) stats.whales++;
    else if (amount >= CONFIG.MINI_WHALE_AMOUNT) stats.miniWhales++;
    if (commitStep >= 1) stats.commit1++;
    if (commitStep >= 2) stats.commit2++;
    if (commitStep >= 3) stats.commit3++;
    if (commitStep >= 4) stats.commit4++;
    if (postStep >= 1) stats.post1++;
    if (postStep >= 2) stats.post2++;
    if (postStep >= 3) stats.post3++;
    if (postStep >= 4) stats.post4++;
    if (postStep >= 5) stats.post5++;
  }

  safeAlert(
    '🐋 WHALE OPS v16.1 Dashboard\n\n'
    + '📦 Total: ' + stats.total + '  |  ⏳ Partial: ' + stats.partial + '\n'
    + '✅ Pending: ' + stats.pending + '  |  ✅ Confirmed: ' + stats.confirmed + '\n'
    + '🚚 Delivered: ' + stats.delivered + '  |  💰 Paid: ' + stats.paid + '\n'
    + '❌ Cancelled: ' + stats.cancelled + '  |  🔄 RTO: ' + stats.rto + '\n'
    + '💎 Whales (₦215k+): ' + stats.whales + '  |  🐬 Mini Whales (₦66k+): ' + stats.miniWhales + '\n\n'
    + '── ENGINE 1: Recovery (Partial → Order) ──\n'
    + 'Nudge (10m): ' + stats.stage1 + '  |  Proof (2h): ' + stats.stage2 + '\n'
    + 'Re-engage (24h): ' + stats.stage3 + '  |  Goodwill (72h): ' + stats.stage4 + '\n'
    + '🔄 Recovered: ' + stats.recovered + '\n\n'
    + '── ENGINE 2: Commitment (Order → Collection) ──\n'
    + 'Routine (30m): ' + stats.commit1 + '  |  Box (4h): ' + stats.commit2 + '\n'
    + 'Social (18h): ' + stats.commit3 + '  |  Pay Prep (36h): ' + stats.commit4 + '\n\n'
    + '── ENGINE 3: Post-Delivery (Delivery → Reorder) ──\n'
    + 'Start Guide (45m): ' + stats.post1 + '  |  First Use (18h): ' + stats.post2 + '\n'
    + 'Day 3 Check (3d): ' + stats.post3 + '  |  Day 7 (7d): ' + stats.post4 + '\n'
    + 'Week 3 Reorder (21d): ' + stats.post5
  );
}

function resetTelesalesRotation() {
  PropertiesService.getScriptProperties().setProperty('lastTelesalesIndex', '-1');
  safeAlert('✅ Telesales rotation reset.');
}


// ============================================================================
// 15. FULL DASHBOARD (writes to Dashboard sheet)
// ============================================================================

function refreshDashboard() {
  var ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  var ordersSheet = ss.getSheetByName(CONFIG.ORDERS_SHEET);
  if (!ordersSheet || ordersSheet.getLastRow() < 2) { safeAlert('No orders yet.'); return; }

  var data = ordersSheet.getDataRange().getValues();
  var now = new Date();
  var todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  var weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  var monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  var today = { orders: 0, abandoned: 0, expected: 0, actual: 0, delivered: 0 };
  var week = { orders: 0, abandoned: 0, expected: 0, actual: 0, delivered: 0 };
  var month = { orders: 0, abandoned: 0, expected: 0, actual: 0, delivered: 0 };
  var all = { orders: 0, revenue: 0, paid: 0, delivered: 0, pending: 0, cancelled: 0, rto: 0, partial: 0, confirmed: 0, assigned: 0, outForDelivery: 0 };

  var telesales = {};
  var das = {};
  var packages = {};
  var states = {};
  var recovered = 0;

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var ts = new Date(row[1]);
    var status = row[19] || '';
    var amount = Number(row[9]) || 0;
    var deliveryFee = Number(row[14]) || 3000;
    var total = amount + deliveryFee;
    var pkg = row[6] || 'Unknown';
    var state = row[10] || 'Unknown';
    var salesName = row[20] || '';
    var daName = row[21] || '';
    var recoveryStep = parseInt(row[34] || 0, 10);

    var isComplete = status !== 'Partial' && status !== '';
    var isPaid = status === 'Paid';
    var isDelivered = status === 'Delivered' || status === 'Paid';
    var isCancelled = status === 'Cancelled';
    var isRTO = status === 'RTO';

    if (ts >= todayStart && isComplete) { today.orders++; today.expected += total; if (isPaid) today.actual += total; if (isDelivered) today.delivered++; }
    if (ts >= todayStart && status === 'Partial') today.abandoned++;
    if (ts >= weekStart && isComplete) { week.orders++; week.expected += total; if (isPaid) week.actual += total; if (isDelivered) week.delivered++; }
    if (ts >= weekStart && status === 'Partial') week.abandoned++;
    if (ts >= monthStart && isComplete) { month.orders++; month.expected += total; if (isPaid) month.actual += total; if (isDelivered) month.delivered++; }
    if (ts >= monthStart && status === 'Partial') month.abandoned++;

    all.orders++;
    if (isPaid) { all.paid++; all.revenue += total; }
    if (isDelivered) all.delivered++;
    if (status === 'Pending') all.pending++;
    if (status === 'Confirmed') all.confirmed++;
    if (status === 'Assigned') all.assigned++;
    if (status === 'Out for Delivery') all.outForDelivery++;
    if (isCancelled) all.cancelled++;
    if (isRTO) all.rto++;
    if (status === 'Partial') all.partial++;
    if ((status === 'Pending' || status === 'Confirmed' || status === 'Paid') && recoveryStep > 0 && recoveryStep < 99) recovered++;

    if (salesName && isComplete) {
      if (!telesales[salesName]) telesales[salesName] = { assigned: 0, confirmed: 0, paid: 0, revenue: 0 };
      telesales[salesName].assigned++;
      if (status === 'Confirmed' || status === 'Assigned' || status === 'Out for Delivery' || isDelivered) telesales[salesName].confirmed++;
      if (isPaid) { telesales[salesName].paid++; telesales[salesName].revenue += total; }
    }

    if (daName) {
      if (!das[daName]) das[daName] = { assigned: 0, delivered: 0, cancelled: 0 };
      das[daName].assigned++;
      if (isDelivered) das[daName].delivered++;
      if (isCancelled || isRTO) das[daName].cancelled++;
    }

    if (isComplete) {
      var pkgClean = pkg.toString().trim();
      if (pkgClean && pkgClean.toLowerCase().indexOf('not selected') === -1) {
        if (!packages[pkgClean]) packages[pkgClean] = { orders: 0, paidDelivered: 0, revenue: 0 };
        packages[pkgClean].orders++;
        if (isDelivered || isPaid) { packages[pkgClean].paidDelivered++; packages[pkgClean].revenue += total; }
      }
    }

    if (isComplete) {
      var stClean = state.toString().trim() || 'Unknown';
      if (!states[stClean]) states[stClean] = { orders: 0, paidDelivered: 0, revenue: 0 };
      states[stClean].orders++;
      if (isDelivered || isPaid) { states[stClean].paidDelivered++; states[stClean].revenue += total; }
    }
  }

  var dashSheet = ss.getSheetByName('Dashboard');
  if (!dashSheet) dashSheet = ss.insertSheet('Dashboard');
  dashSheet.clear();
  dashSheet.setColumnWidth(1, 200);
  for (var c = 2; c <= 9; c++) dashSheet.setColumnWidth(c, 130);

  var rows = [];
  var fmt = function(n) { return '₦' + Number(n).toLocaleString('en-NG'); };
  var pct = function(a, b) { return b > 0 ? Math.round(a / b * 100) + '%' : '-'; };

  rows.push(['💚 FULANI HAIR GRO DASHBOARD', '', '', '', '', '', '', '', '']);
  rows.push(['Last Updated: ' + Utilities.formatDate(now, 'Africa/Lagos', 'MMM dd, yyyy HH:mm'), '', '', '', '', '', '', '', '']);
  rows.push(['', '', '', '', '', '', '', '', '']);
  rows.push(['📅 TODAY', '', '', '', '', '', '', '', '']);
  rows.push(['📦 Orders', '', '🛒 Abandoned', '', '💰 Expected', '', '✅ Actual', '', '🚚 Delivered']);
  rows.push([today.orders, '', today.abandoned, '', fmt(today.expected), '', fmt(today.actual), '', today.delivered]);
  rows.push(['', '', '', '', '', '', '', '', '']);
  rows.push(['📆 THIS WEEK', '', '', '', '', '', '', '', '']);
  rows.push(['📦 Orders', '', '🛒 Abandoned', '', '💰 Expected', '', '✅ Actual', '', '🚚 Delivered']);
  rows.push([week.orders, '', week.abandoned, '', fmt(week.expected), '', fmt(week.actual), '', week.delivered]);
  rows.push(['', '', '', '', '', '', '', '', '']);
  rows.push(['🗓️ THIS MONTH', '', '', '', '', '', '', '', '']);
  rows.push(['📦 Orders', '', '🛒 Abandoned', '', '💰 Expected', '', '✅ Actual', '', '🚚 Delivered']);
  rows.push([month.orders, '', month.abandoned, '', fmt(month.expected), '', fmt(month.actual), '', month.delivered]);
  rows.push(['', '', '', '', '', '', '', '', '']);
  rows.push(['📊 ALL TIME', '', '', '', '', '', '', '', '']);
  rows.push(['📦 Total Orders', '', '💰 Total Revenue', '', '✅ Paid Orders', '', '📦 Delivered', '', '']);
  rows.push([all.orders, '', fmt(all.revenue), '', all.paid, '', all.delivered, '', '']);
  rows.push(['', '', '', '', '', '', '', '', '']);
  rows.push(['⏳ Pending', '', '❌ Cancelled/RTO', '', '🔄 Partial (Cart)', '', '📈 Conversion', '', '']);
  rows.push([all.pending + all.confirmed + all.assigned + all.outForDelivery, '', all.cancelled + all.rto, '', all.partial, '', pct(all.paid, all.orders - all.partial), '', '']);
  rows.push(['', '', '', '', '', '', '', '', '']);
  rows.push(['', '', '', '', '', '', '', '', '']);
  rows.push(['📋 ORDER STATUS BREAKDOWN', '', '', '', '', '', '', '', '']);
  rows.push(['Partial', all.partial, 'Pending', all.pending, 'Confirmed', all.confirmed, 'Assigned', all.assigned, '']);
  rows.push(['', '', '', '', '', '', '', '', '']);
  rows.push(['Out for Delivery', all.outForDelivery, 'Paid', all.paid, 'Delivered', all.delivered, 'Cancelled', all.cancelled + all.rto, '']);
  rows.push(['', '', '', '', '', '', '', '', '']);
  rows.push(['', '', '', '', '', '', '', '', '']);
  rows.push(['👤 TELESALES PERFORMANCE', '', '', '', '', '', '', '', '']);
  rows.push(['Name', 'Assigned', 'Confirmed', 'Paid', 'Success %', 'Revenue', '', '', '']);
  var salesNames = Object.keys(telesales).sort(function(a, b) { return telesales[b].revenue - telesales[a].revenue; });
  for (var s = 0; s < salesNames.length; s++) {
    var ts2 = telesales[salesNames[s]];
    rows.push([salesNames[s], ts2.assigned, ts2.confirmed, ts2.paid, pct(ts2.paid, ts2.assigned), fmt(ts2.revenue), '', '', '']);
  }
  rows.push(['', '', '', '', '', '', '', '', '']);
  rows.push(['', '', '', '', '', '', '', '', '']);
  rows.push(['🚴 DELIVERY AGENT PERFORMANCE', '', '', '', '', '', '', '', '']);
  rows.push(['Name', 'Assigned', 'Delivered', 'Cancelled', 'Success %', '', '', '', '']);
  for (var d = 0; d < DA_LIST.length; d++) {
    var dn = DA_LIST[d].name;
    var daStats = das[dn] || { assigned: 0, delivered: 0, cancelled: 0 };
    rows.push([dn, daStats.assigned, daStats.delivered, daStats.cancelled, pct(daStats.delivered, daStats.assigned), '', '', '', '']);
  }
  rows.push(['', '', '', '', '', '', '', '', '']);
  rows.push(['', '', '', '', '', '', '', '', '']);
  rows.push(['📦 PACKAGE BREAKDOWN', '', '', '', '', '', '', '', '']);
  rows.push(['Package', 'Orders', 'Paid/Delivered', 'Revenue', '', '', '', '', '']);
  var pkgNames = Object.keys(packages).sort(function(a, b) { return packages[b].revenue - packages[a].revenue; });
  for (var p = 0; p < pkgNames.length; p++) {
    var pk = packages[pkgNames[p]];
    rows.push([pkgNames[p], pk.orders, pk.paidDelivered, fmt(pk.revenue), '', '', '', '', '']);
  }
  rows.push(['', '', '', '', '', '', '', '', '']);
  rows.push(['', '', '', '', '', '', '', '', '']);
  rows.push(['🔄 CART RECOVERY', '', '', '', '', '', '', '', '']);
  rows.push(['Total Partial Orders', all.partial, '', '', '', '', '', '', '']);
  rows.push(['Recovered (to Paid)', recovered, '', '', '', '', '', '', '']);
  rows.push(['Conversion Rate', pct(all.paid, all.orders - all.partial), '', '', '', '', '', '', '']);
  rows.push(['Revenue (Paid)', fmt(all.revenue), '', '', '', '', '', '', '']);
  rows.push(['', '', '', '', '', '', '', '', '']);
  rows.push(['', '', '', '', '', '', '', '', '']);
  rows.push(['📍 TOP STATES', '', '', '', '', '', '', '', '']);
  rows.push(['State', 'Orders', 'Paid/Delivered', 'Revenue', 'Success %', '', '', '', '']);
  var stateNames = Object.keys(states).sort(function(a, b) { return states[b].orders - states[a].orders; });
  for (var st = 0; st < Math.min(stateNames.length, 15); st++) {
    var stData = states[stateNames[st]];
    rows.push([stateNames[st], stData.orders, stData.paidDelivered, fmt(stData.revenue), pct(stData.paidDelivered, stData.orders), '', '', '', '']);
  }
  rows.push(['', '', '', '', '', '', '', '', '']);
  rows.push(['', '', '', '', '', '', '', '', '']);
  rows.push(['💚 Fulani Hair Gro v16.1 • Run "Refresh Dashboard" to update', '', '', '', '', '', '', '', '']);

  dashSheet.getRange(1, 1, rows.length, 9).setValues(rows);

  dashSheet.getRange(1, 1).setFontSize(16).setFontWeight('bold').setFontColor('#2e7d32');
  dashSheet.getRange(2, 1).setFontSize(10).setFontColor('#757575');

  var sectionRows = [];
  for (var r = 0; r < rows.length; r++) {
    var cell = rows[r][0].toString();
    if (cell.match(/^(📅|📆|🗓️|📊|📋|👤|🚴|📦|🔄|📍)/)) sectionRows.push(r + 1);
  }
  for (var sr = 0; sr < sectionRows.length; sr++) {
    dashSheet.getRange(sectionRows[sr], 1, 1, 9).setFontWeight('bold').setFontSize(12).setBackground('#E8F5E9');
  }

  for (var r2 = 0; r2 < rows.length; r2++) {
    var cell2 = rows[r2][0].toString();
    if (cell2 === 'Name' || cell2 === 'Package' || cell2 === 'State' || cell2.match(/^(📦 Orders|📦 Total|⏳ Pending)/)) {
      dashSheet.getRange(r2 + 1, 1, 1, 9).setFontWeight('bold').setBackground('#F5F5F5');
    }
  }

  dashSheet.getRange(rows.length, 1).setFontSize(9).setFontColor('#9E9E9E');
  dashSheet.setFrozenRows(2);
  ss.setActiveSheet(dashSheet);
  safeAlert('✅ Dashboard refreshed!');
}

function testStage2Images() {
  var testPhone = '08012345678';
  sendWhatsApp(testPhone, getRecoveryMessage(2, 'Self Love Plus B2GOF', 'Test User', 66750, 'TEST-001'));
  safeAlert('✅ Stage 2 test sent to ' + testPhone);
}

function runRecoveryOnly() {
  var ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  var sheet = ss.getSheetByName(CONFIG.ORDERS_SHEET);
  if (!sheet || sheet.getLastRow() < 2) return;

  var data = sheet.getDataRange().getValues();
  var now = new Date();
  var recoveryCount = 0;

  for (var i = 1; i < data.length; i++) {
    var status = data[i][19];
    var currentStep = parseInt(data[i][34] || 0, 10);
    var createdAt = new Date(data[i][1]);
    var phone = data[i][3];
    if (status !== 'Partial' || currentStep >= 4 || !phone) continue;

    var diffMins = (now - createdAt) / 60000;
    var nextStage = null;
    for (var s = 0; s < RECOVERY_STAGES.length; s++) {
      if (RECOVERY_STAGES[s].step === (currentStep + 1)) { nextStage = RECOVERY_STAGES[s]; break; }
    }
    if (nextStage && diffMins >= nextStage.delay) {
      var msg = getRecoveryMessage(nextStage.step, data[i][6], data[i][2], data[i][9], data[i][0]);
      if (sendWhatsApp(phone, msg)) {
        sheet.getRange(i + 1, 35).setValue(nextStage.step);
        recoveryCount++;
      }
    }
  }

  if (recoveryCount > 0) safeAlert('✅ Sent ' + recoveryCount + ' recovery messages.');
  else safeAlert('No recovery messages to send right now.');
}


function setupSheets() {
  var ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);

  var tsSheet = ss.getSheetByName(CONFIG.TELESALES_SHEET);
  if (!tsSheet) {
    tsSheet = ss.insertSheet(CONFIG.TELESALES_SHEET);
    tsSheet.appendRow(['Name', 'Phone', 'Status']);
    for (var t = 0; t < TELESALES_LIST.length; t++) {
      var ts = TELESALES_LIST[t];
      tsSheet.appendRow([ts.name, '0' + ts.phone.substring(3), 'Active']);
    }
    tsSheet.getRange(1, 1, 1, 3).setFontWeight('bold').setBackground('#E8F5E9');
    tsSheet.setColumnWidth(1, 150);
    tsSheet.setColumnWidth(2, 150);
    tsSheet.setColumnWidth(3, 100);
    var statusRule = SpreadsheetApp.newDataValidation().requireValueInList(['Active', 'Inactive'], true).setAllowInvalid(false).build();
    tsSheet.getRange(2, 3, 50, 1).setDataValidation(statusRule);
  }

  var daSheet = ss.getSheetByName(CONFIG.DA_SHEET);
  if (!daSheet) {
    daSheet = ss.insertSheet(CONFIG.DA_SHEET);
    daSheet.appendRow(['Name', 'Phone', 'State/Zone', 'Status']);
    for (var i = 0; i < DA_LIST.length; i++) {
      var da = DA_LIST[i];
      var displayPhone = '0' + da.phone.substring(3);
      daSheet.appendRow([da.name, displayPhone, da.state, 'Active']);
    }
    daSheet.getRange(1, 1, 1, 4).setFontWeight('bold').setBackground('#e65100').setFontColor('#ffffff');
    daSheet.setColumnWidth(1, 240);
    daSheet.setColumnWidth(2, 140);
    daSheet.setColumnWidth(3, 130);
    daSheet.setColumnWidth(4, 100);
    var daStatusRule = SpreadsheetApp.newDataValidation().requireValueInList(['Active', 'Inactive'], true).setAllowInvalid(false).build();
    daSheet.getRange(2, 4, 50, 1).setDataValidation(daStatusRule);
    var rules = daSheet.getConditionalFormatRules();
    rules.push(SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('Active').setBackground('#e8f5e9').setRanges([daSheet.getRange('D2:D100')]).build());
    rules.push(SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('Inactive').setBackground('#ffebee').setRanges([daSheet.getRange('D2:D100')]).build());
    daSheet.setConditionalFormatRules(rules);
  }

  var qSheet = ss.getSheetByName(CONFIG.WEBHOOK_QUEUE);
  if (!qSheet) {
    qSheet = ss.insertSheet(CONFIG.WEBHOOK_QUEUE);
    qSheet.appendRow(['Queue ID', 'Received', 'Type', 'Source', 'Payload', 'Status', 'Processed At']);
    qSheet.getRange(1, 1, 1, 7).setFontWeight('bold').setBackground('#FFF8E1');
  }

  applyOrderDropdowns();
  return '✅ Sheets ready';
}


function applyOrderDropdowns() {
  var ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  var sheet = ss.getSheetByName(CONFIG.ORDERS_SHEET);
  if (!sheet || sheet.getLastRow() < 1) return;

  var headerV = sheet.getRange(1, 22).getValue();
  var headerW = sheet.getRange(1, 23).getValue();
  if (!headerV) sheet.getRange(1, 22).setValue('Delivery Agent').setFontWeight('bold');
  if (!headerW) sheet.getRange(1, 23).setValue('DA Phone').setFontWeight('bold');

  sheet.getRange(2, 20, 1000, 1).setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(CONFIG.STATUSES, true).setAllowInvalid(false).build()
  );

  var daNames = DA_LIST.map(function(da) { return da.name; });
  sheet.getRange(2, 22, 1000, 1).setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(daNames, true).setAllowInvalid(true).build()
  );

  console.log('✅ Dropdowns applied: Status (col T) + DA (col V) with ' + daNames.length + ' agents');
}


function setupTriggers() {
  setupSheets();
  var triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(function(t) { ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('processWebhookQueue').timeBased().everyMinutes(1).create();
  ScriptApp.newTrigger('processCartRecovery').timeBased().everyMinutes(5).create();
  ScriptApp.newTrigger('onEditInstallable').forSpreadsheet(SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID)).onEdit().create();
  safeAlert('✅ Sheets + Triggers set: Queue (1 min) + Recovery (5 min) + onEdit (WhatsApp)');
}

function onEditInstallable(e) {
  onEdit(e);
}
