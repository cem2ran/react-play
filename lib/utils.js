export const encode = (s) => btoa(unescape(encodeURIComponent(s)).replace(/[\u00A0-\u2666]/g, c => '&#' + c.charCodeAt(0) + ';'))

export const decode = (s) => decodeURIComponent(escape(atob(s)))

export const sfxPayload = (origin, payload) =>
  !payload
    ? ''
    : ['<script src="https://jspm.io/system@0.19.7.js"></script><script type="text/javascript">'
      ,'System.config({ map: { base64: "'+origin+'/base64-plugin.js"}, transpiler: "babel", babelOptions: {"stage": 0}});'
      ,'setTimeout(function(){ System.import("' + btoa(payload) +'!base64")}, 0);'
      ,'</script>'].join(' ')

import 'whatwg-fetch'
export const createShortURL = (URL_SHORTENER_API_KEY) => (URL) => window.fetch(`https://www.googleapis.com/urlshortener/v1/url?key=${URL_SHORTENER_API_KEY}`, {
  method: 'post',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    longUrl: URL
  })
})
.then(response => response.json())
