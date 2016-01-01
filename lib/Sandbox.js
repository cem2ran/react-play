import React from 'react';
import srcDoc from 'srcdoc-polyfill';

const Sandbox = ({src, html, sandbox, style={}}) => {
  sandbox = sandbox ? sandbox.join(' ') : ''

  return <iframe src={src} srcDoc={html} style={{
      ...{width: '100%', height: '100%', border: '0'},
      ...style
    }} sandbox={sandbox} />;
}

export default Sandbox
