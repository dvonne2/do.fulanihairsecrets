// Facebook Pixel initialization (stub is in index.html)
(function() {
  try {
    var id = localStorage.getItem('fhg_external_id');
    if (!id) {
      var chars = '0123456789abcdef';
      id = '';
      for (var i = 0; i < 16; i++) id += chars[Math.floor(Math.random() * 16)];
      localStorage.setItem('fhg_external_id', id);
    }
    window.__fhgExternalId = id;
  } catch (e) {
    window.__fhgExternalId = '';
  }
})();

var fhgInitParams;
try {
  var rawIdentity = localStorage.getItem('fhg_identity');
  var identity = rawIdentity ? JSON.parse(rawIdentity) : null;
  var isExpired = !identity || Date.now() >= (identity.expiresAt || 0);
  fhgInitParams = { external_id: window.__fhgExternalId || '' };
  if (!isExpired) {
    if (identity.email) fhgInitParams.em = String(identity.email).trim().toLowerCase();
    if (identity.phone) fhgInitParams.ph = String(identity.phone).replace(/\D/g, '');
    if (identity.firstName) fhgInitParams.fn = String(identity.firstName).trim().toLowerCase();
    if (identity.lastName) fhgInitParams.ln = String(identity.lastName).trim().toLowerCase();
    if (identity.city) fhgInitParams.ct = String(identity.city).trim().toLowerCase();
    if (identity.state) fhgInitParams.st = String(identity.state).trim().toLowerCase();
    if (identity.gender) fhgInitParams.ge = String(identity.gender).trim().toLowerCase();
    fhgInitParams.country = 'ng';
  }
} catch (e) {
  fhgInitParams = { external_id: window.__fhgExternalId || '' };
}

// Restore persisted click/browser IDs into init params so the pixel has them
// even when cookies are blocked by Safari ITP.
try {
  var fbcPersisted = localStorage.getItem('meta_fbc_data');
  if (fbcPersisted) {
    var fbcObj = JSON.parse(fbcPersisted);
    if (fbcObj && fbcObj.fbc && Date.now() < (fbcObj.expiresAt || 0)) {
      fhgInitParams.fbc = fbcObj.fbc;
    }
  }
} catch (e) {}

try {
  var fbpPersisted = localStorage.getItem('meta_fbp_persist');
  if (fbpPersisted) {
    var fbpObj = JSON.parse(fbpPersisted);
    if (fbpObj && fbpObj.fbp && Date.now() < (fbpObj.expiresAt || 0) && String(fbpObj.fbp).indexOf('fb.') === 0) {
      fhgInitParams.fbp = fbpObj.fbp;
    }
  }
} catch (e) {}

if (window.__metaPixelsInitialized) {
  // Pixel was already initialized by the React bundle (reinitPixelWithUserData)
} else {
  fbq('init', '220381209723501', fhgInitParams);
  window.__metaPixelsInitialized = true;
}
if(!window.__pvEventId){window.__pvEventId=(function(){for(var s='',i=0;i<16;i++)s+='0123456789abcdef'[Math.random()*16|0];return s})();}
fbq('track', 'PageView', {}, {eventID: window.__pvEventId});

// TikTok Pixel initialization (stub is in index.html)
ttq.load('D6I4NQRC77U4M1757710');
ttq.page();
