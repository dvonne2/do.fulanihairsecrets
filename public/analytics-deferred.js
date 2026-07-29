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

var fhgInitParams = (window.__fhgExternalId ? { external_id: window.__fhgExternalId } : {});

fbq('init', '220381209723501', fhgInitParams);
fbq('init', '2709676702727852', fhgInitParams);
fbq('init', '964049967992063', fhgInitParams);
fbq('init', '1481974843635740', fhgInitParams);
window.__metaPixelsInitialized = true;
window.__pvEventId=(function(){for(var s='',i=0;i<16;i++)s+='0123456789abcdef'[Math.random()*16|0];return s})();
fbq('track', 'PageView', {}, {eventID: window.__pvEventId});

// TikTok Pixel initialization (stub is in index.html)
ttq.load('D6I4NQRC77U4M1757710');
ttq.page();
