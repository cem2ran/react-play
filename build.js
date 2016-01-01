import React from 'react'
import { renderToString } from 'react-dom/server'
import App from './index'

function renderFullPage(html, config, initialState) {
  return `
    <!doctype html>
    <html>
      <head>
        <title>React Play</title>
        <style>
          body{
            margin: 0;
            padding: 0;

            font-family: -apple-system, BlinkMacSystemFont,
              "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell",
              "Fira Sans", "Droid Sans", "Helvetica Neue",
              sans-serif;
          }
        </style>
      </head>
      <body>
        <div id="react.play">${html}</div>
        <script src="system.js"></script>
        <script src="config.js"></script>
        <script>
          window.__INITIAL_STATE__ = location.hash.slice(1) || localStorage.getItem(${config['STORAGE_KEY']} || '') || ${JSON.stringify(initialState)}
          System.import('./index.js');
        </script>
      </body>
    </html>
    `
}

console.log(
  renderFullPage(renderToString(<App />), {STORAGE_KEY: 'react.play'},)
)
