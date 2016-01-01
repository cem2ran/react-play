import React from 'react';

const Sandbox = ({src='', html, sandbox, style={}}) => {
  if(html){ //https://github.com/npm-dom/iframe/blob/master/index.js#L38-L40
    var blob = new Blob([html], { encoding: 'UTF-8', type: 'text/html' })
    var U = typeof URL !== 'undefined' ? URL : webkitURL
    src = U.createObjectURL(blob)
  }
  sandbox = sandbox ? sandbox.join(' ') : ''

  return <iframe src={src} style={{
      ...{width: '100%', height: '100%', border: '0'},
      ...style
    }} sandbox={sandbox} />;
}

export default Sandbox
