import React, {Component, PropTypes} from 'react';
import { render } from 'react-dom';
import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/javascript';
import 'brace/theme/chrome';

import 'whatwg-fetch'

import {debounce} from 'lodash'

import Sandbox from './Sandbox'
import {encode, decode, sfxPayload, createShortURL} from './utils'

const STORAGE_KEY = 'react.play'

export default class ReactPlay extends Component {
  static propTypes = {
    STORAGE_KEY: PropTypes.string
  }

  constructor(props){
    super(props)
    const saved_code = localStorage.getItem(this.props.STORAGE_KEY || STORAGE_KEY)
    this.state = {
      code: (location.hash && decode(location.hash.slice(1))) || saved_code && decode(saved_code) || '//write your code here...'
    }
  }
  render(){
    return <div style={{width: '100%', height: '100%', position: 'absolute'}}>
        <div style={{float: 'left', width: '50%', height: '100%'}}>
          <AceEditor
            mode="javascript"
            theme="chrome"
            height={"100%"}
            width={"100%"}
            value={this.state.code}
            onChange={debounce(this.onChange.bind(this), 750)}
            name="react_play_editor"
            onLoad={editor => editor.getSession().setUseWorker(false)}
            editorProps={{
              $blockScrolling: true,
              style:{ position: 'absolute' }
            }}
          />
        </div>
        <Sandbox
          style={{width: '50%'}}
          html={sfxPayload(location.origin, this.state.code)}
          sandbox={['allow-scripts']}/>
      </div>
  }

  onChange(code) { if(this.state.code != code){
    this.setState({code})
    localStorage.setItem(this.props.STORAGE_KEY || STORAGE_KEY, encode(code))
    location.hash = encode(code)
  }}
}
