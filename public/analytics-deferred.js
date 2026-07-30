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

(function() {
  var PIXEL_IDS = [
    '220381209723501',
    '2709676702727852',
    '964049967992063',
    '1481974843635740'
  ];
  var PIXEL_MAP = {
    '1': '220381209723501',
    '2': '2709676702727852',
    '3': '964049967992063',
    '4': '1481974843635740'
  };

  // Resolve the selected pixel: URL parameter wins; otherwise use stored valid value; default to Pixel 1
  var stored = null;
  try { stored = localStorage.getItem('fhg_pixel'); } catch (e) {}
  if (!stored || PIXEL_IDS.indexOf(stored) === -1) stored = PIXEL_IDS[0];

  var selectedFromUrl = null;
  try {
    selectedFromUrl = new URLSearchParams(window.location.search).get('pixel');
  } catch (e) {}

  var selectedPixelId = stored;
  if (selectedFromUrl) {
    var mapped = PIXEL_MAP[selectedFromUrl];
    if (mapped) {
      selectedPixelId = mapped;
      try { localStorage.setItem('fhg_pixel', selectedPixelId); } catch (e) {}
    }
    // invalid pixel param is ignored and does not overwrite the stored selection
  }

  window.__fhgSelectedPixelId = selectedPixelId;
  window.__fhgPixelNumber = String(PIXEL_IDS.indexOf(selectedPixelId) + 1);

  try { localStorage.setItem('fhg_pixel', selectedPixelId); } catch (e) {}

  var fhgInitParams = (window.__fhgExternalId ? { external_id: window.__fhgExternalId } : {});

  PIXEL_IDS.forEach(function(id) {
    fbq('init', id, fhgInitParams);
  });
  window.__metaPixelsInitialized = true;

  window.__pvEventId = (function() {
    var s = '';
    for (var i = 0; i < 16; i++) s += '0123456789abcdef'[Math.random() * 16 | 0];
    return s;
  })();

  // PageView reaches all four pixels for audience building
  fbq('track', 'PageView', {}, { eventID: window.__pvEventId });
})();

// TikTok Pixel initialization (stub is in index.html)
ttq.load('D6I4NQRC77U4M1757710');
ttq.page();
