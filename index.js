import React, {Component} from 'react';
import { render } from 'react-dom';

import App from './lib/App'

render(<App
    URL_SHORTENER_API_KEY='AIzaSyDWTq7IC6rR7xSu25lDnW6BSDafV1dyLFc'
    GITHUB_CLIENT_ID='d3e47654f7542fb40d2e'
    GITHUB_TOKEN_ENDPOINT='https://gatekeeper.ce.ms/authenticate/'
    STORAGE_KEY='react.play'
  />, document.body.appendChild(document.createElement("react.play")));
