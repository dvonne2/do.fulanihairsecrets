window.addEventListener('load', function() {
  // Facebook Pixel initialization (stub is in index.html)
  fbq('init', '220381209723501');
  fbq('init', '2709676702727852');
  fbq('init', '964049967992063');
  fbq('init', '1481974843635740');
  window.__pvEventId=(function(){for(var s='',i=0;i<16;i++)s+='0123456789abcdef'[Math.random()*16|0];return s})();
  fbq('track', 'PageView', {}, {eventID: window.__pvEventId});

  // TikTok Pixel initialization (stub is in index.html)
  ttq.load('D6I4NQRC77U4M1757710');
  ttq.page();
});
