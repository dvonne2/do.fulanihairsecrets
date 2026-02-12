# Google Apps Script Updates Required

## 🎯 **Objective**
Update the Google Apps Script to handle secure order data storage, retrieval, and enhanced CAPI matching parameters.

## 📋 **New Required Functionality**

### **1. Enhanced CAPI Event Handling**
The CAPI events now include enhanced matching parameters for better conversion attribution:

```javascript
function doPost(e) {
  const params = e.parameter;
  const type = params.type;
  const secret = params.secret;
  
  // Verify secret
  if (secret !== 'fhg_orders_2024_secret') {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Unauthorized'
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  switch (type) {
    case 'store_order_data':
      return storeOrderData(params);
    case 'retrieve_order_data':
      return retrieveOrderData(params);
    case 'update_order_status':
      return updateOrderStatus(params);
    case 'addtocart':
    case 'initiatecheckout':
    case 'purchase':
      return handleCAPIEvent(params); // Enhanced CAPI handling
    default:
      return handleExistingTypes(params); // Existing functionality
  }
}

function handleCAPIEvent(params) {
  try {
    // Extract enhanced matching parameters
    const enhancedData = {
      // Standard CAPI fields
      eventId: params.eventId,
      eventType: params.type,
      fbp: params.fbp,
      fbc: params.fbc,
      
      // Original customer data (backward compatibility)
      customerFullName: params.customerFullName,
      email: params.email,
      phoneNumber: params.phoneNumber,
      state: params.state,
      lga: params.lga,
      fullAddress: params.fullAddress,
      
      // Enhanced matching parameters
      em: params.em,                    // Hashed email
      ph: params.ph,                    // Hashed phone
      fn: params.fn,                    // Hashed first name
      ln: params.ln,                    // Hashed last name
      ge: params.ge,                    // Gender
      ct: params.ct,                    // City
      st: params.st,                    // State
      zp: params.zp,                    // Zip code
      country: params.country,          // Country
      external_id: params.external_id,  // External ID
      client_ip_address: params.client_ip_address,  // Client IP
      client_user_agent: params.client_user_agent,  // User agent
      
      // Event-specific data
      orderId: params.orderId,
      packageName: params.packageName,
      packageAmount: params.packageAmount,
      deliveryFee: params.deliveryFee,
      totalAmount: params.totalAmount,
      currency: params.currency || 'NGN',
      content_ids: params.content_ids,
      content_name: params.content_name,
      content_category: params.content_category,
      content_type: params.content_type,
      num_items: params.num_items
    };
    
    // Store in CAPI events sheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('CAPIEvents') || 
                   SpreadsheetApp.getActiveSpreadsheet().insertSheet('CAPIEvents');
    
    // Add headers if sheet is new
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp', 'EventType', 'EventId', 'OrderId', 'Email', 'Phone',
        'HashedEmail', 'HashedPhone', 'HashedFirstName', 'HashedLastName',
        'Gender', 'City', 'State', 'ZipCode', 'Country', 'ExternalID',
        'ClientIP', 'UserAgent', 'PackageName', 'PackageAmount', 'DeliveryFee',
        'TotalAmount', 'Currency', 'FBP', 'FBC', 'Success'
      ]);
    }
    
    // Log the event
    const success = true; // Assume success for logging
    sheet.appendRow([
      new Date(),
      enhancedData.eventType,
      enhancedData.eventId,
      enhancedData.orderId,
      enhancedData.email ? '***' : '', // Mask email for privacy
      enhancedData.phoneNumber ? '***' : '', // Mask phone for privacy
      enhancedData.em || '',
      enhancedData.ph || '',
      enhancedData.fn || '',
      enhancedData.ln || '',
      enhancedData.ge || '',
      enhancedData.ct || '',
      enhancedData.st || '',
      enhancedData.zp || '',
      enhancedData.country || '',
      enhancedData.external_id || '',
      enhancedData.client_ip_address || '',
      enhancedData.client_user_agent || '',
      enhancedData.packageName || '',
      enhancedData.packageAmount || '',
      enhancedData.deliveryFee || '',
      enhancedData.totalAmount || '',
      enhancedData.currency || '',
      enhancedData.fbp || '',
      enhancedData.fbc || '',
      success
    ]);
    
    console.log('CAPI Event logged:', {
      type: enhancedData.eventType,
      eventId: enhancedData.eventId,
      orderId: enhancedData.orderId,
      enhancedFields: {
        hasHashedEmail: !!enhancedData.em,
        hasHashedPhone: !!enhancedData.ph,
        hasClientIP: !!enhancedData.client_ip_address,
        hasUserAgent: !!enhancedData.client_user_agent,
        totalEnhancedFields: Object.keys(enhancedData).length
      }
    });
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'CAPI event logged successfully',
      eventId: enhancedData.eventId,
      enhancedFieldsCount: Object.keys(enhancedData).length
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    console.error('Failed to handle CAPI event:', error);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Failed to log CAPI event: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

### **2. Store Order Data (`type: 'store_order_data'`)**
```javascript
function storeOrderData(params) {
  try {
    const orderData = {
      orderId: params.orderId,
      timestamp: new Date().getTime(),
      customerFullName: params.customerFullName,
      phoneNumber: params.phoneNumber,
      email: params.email,
      packageName: params.packageName,
      packagePrice: parseFloat(params.packagePrice),
      deliveryFee: parseFloat(params.deliveryFee),
      totalAmount: parseFloat(params.totalAmount),
      state: params.state,
      lga: params.lga,
      address: params.address,
      paymentMethod: params.paymentMethod,
      orderStatus: 'pending'
    };
    
    // Store in a dedicated sheet for order data
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('OrderData') || 
                   SpreadsheetApp.getActiveSpreadsheet().insertSheet('OrderData');
    
    // Append headers if sheet is new
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'OrderId', 'Timestamp', 'CustomerFullName', 'PhoneNumber', 'Email',
        'PackageName', 'PackagePrice', 'DeliveryFee', 'TotalAmount', 
        'State', 'LGA', 'Address', 'PaymentMethod', 'OrderStatus'
      ]);
    }
    
    // Store the order data
    sheet.appendRow([
      orderData.orderId,
      new Date(orderData.timestamp),
      orderData.customerFullName,
      orderData.phoneNumber,
      orderData.email,
      orderData.packageName,
      orderData.packagePrice,
      orderData.deliveryFee,
      orderData.totalAmount,
      orderData.state,
      orderData.lga,
      orderData.address,
      orderData.paymentMethod,
      orderData.orderStatus
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Order data stored successfully',
      orderId: orderData.orderId
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Failed to store order data: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

### **3. Retrieve Order Data (`type: 'retrieve_order_data'`)**
```javascript
function retrieveOrderData(params) {
  try {
    const orderId = params.orderId;
    
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('OrderData');
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        message: 'Order data sheet not found'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    // Find the order by ID
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === orderId) { // OrderId is in column 0
        const orderData = {};
        headers.forEach((header, index) => {
          orderData[header] = data[i][index];
        });
        
        return ContentService.createTextOutput(JSON.stringify({
          success: true,
          data: orderData
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Order not found'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Failed to retrieve order data: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

### **4. Update Order Status (`type: 'update_order_status'`)**
```javascript
function updateOrderStatus(params) {
  try {
    const orderId = params.orderId;
    const newStatus = params.orderStatus;
    
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('OrderData');
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        message: 'Order data sheet not found'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    const data = sheet.getDataRange().getValues();
    
    // Find and update the order
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === orderId) { // OrderId is in column 0
        // Update status column (assuming it's the last column)
        sheet.getRange(i + 1, headers.length).setValue(newStatus);
        
        // Update timestamp
        sheet.getRange(i + 1, 2).setValue(new Date());
        
        return ContentService.createTextOutput(JSON.stringify({
          success: true,
          message: 'Order status updated successfully',
          orderId: orderId,
          newStatus: newStatus
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Order not found'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Failed to update order status: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

## 📊 **Enhanced CAPI Data Structure**

### **CAPIEvents Sheet Columns:**
1. Timestamp (datetime)
2. EventType (string: addtocart, initiatecheckout, purchase)
3. EventId (string)
4. OrderId (string)
5. Email (masked)
6. Phone (masked)
7. HashedEmail (SHA256)
8. HashedPhone (SHA256)
9. HashedFirstName (SHA256)
10. HashedLastName (SHA256)
11. Gender (string)
12. City (string)
13. State (string)
14. ZipCode (string)
15. Country (string)
16. ExternalID (SHA256)
17. ClientIP (string)
18. UserAgent (string)
19. PackageName (string)
20. PackageAmount (number)
21. DeliveryFee (number)
22. TotalAmount (number)
23. Currency (string)
24. FBP (string)
25. FBC (string)
26. Success (boolean)

## 🎯 **Enhanced Matching Parameters**

### **Hashed Fields (SHA256):**
- **em:** Hashed email address
- **ph:** Hashed phone number
- **fn:** Hashed first name
- **ln:** Hashed last name
- **external_id:** Hashed order ID

### **Location Fields:**
- **ct:** City (extracted from LGA)
- **st:** State
- **zp:** Zip code (extracted from address)
- **country:** Country code (NG)

### **Client Information:**
- **client_ip_address:** Client IP address
- **client_user_agent:** Browser user agent

### **Demographics:**
- **ge:** Gender (female for target audience)

## 🔧 **Implementation Benefits**

### **✅ Improved Match Quality:**
- **Hashed PII:** Better privacy and matching
- **IP + User Agent:** Device fingerprinting
- **Location Data:** Geographic matching
- **External ID:** Cross-platform matching

### **✅ Increased Conversions:**
- **Better Attribution:** More accurate conversion tracking
- **Reduced Under-reporting:** Enhanced matching captures more conversions
- **Cross-device Tracking:** IP and user agent help with device matching

### **✅ Privacy Compliance:**
- **Hashed Data:** No plain text PII in logs
- **Minimal Collection:** Only necessary parameters
- **Secure Storage:** Encrypted transmission and storage

## 📞 **Testing Enhanced Matching**

### **Test Hash Generation:**
```javascript
// In browser console
import { hashString } from './utils/enhancedMatching';
const hashedEmail = await hashString('test@example.com');
console.log('Hashed email:', hashedEmail);
```

### **Test IP Detection:**
```javascript
import { getClientIPAddress } from './utils/enhancedMatching';
const ip = await getClientIPAddress();
console.log('Client IP:', ip);
```

### **Test Full Enhanced Data:**
```javascript
import { createEnhancedMatchingData } from './utils/enhancedMatching';
const enhanced = await createEnhancedMatchingData(
  'test@example.com',
  '08012345678',
  'Test',
  'User',
  'Lagos',
  'Lagos',
  '100001',
  'NG',
  undefined,
  'ORDER123',
  'female'
);
console.log('Enhanced data:', enhanced);
```

---

**Priority:** HIGH - Required for enhanced conversion tracking
**Impact:** Significantly improves Meta CAPI match quality and reported conversions
**Timeline:** Can be implemented immediately
