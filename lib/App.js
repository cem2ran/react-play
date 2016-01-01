import React, {Component} from 'react';

import Header from './Header'
import ReactPlay from './ReactPlay'

const App = ({
  URL_SHORTENER_API_KEY, STORAGE_KEY
}) => <div>
  <Header URL_SHORTENER_API_KEY={URL_SHORTENER_API_KEY}/>
  <ReactPlay STORAGE_KEY={STORAGE_KEY}/>
</div>

export default App
