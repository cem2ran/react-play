import React, {Component, PropTypes} from 'react';
import { render } from 'react-dom';
import brace from 'brace';
import AceEditor from 'react-ace';
import Dimensions from 'react-dimensions' //used to adjust height of ace editor...

import 'brace/mode/javascript';
import 'brace/theme/chrome';

import {debounce} from 'lodash'

import Sandbox from './Sandbox'

//TODO - refactor: use htmlScaffold
const sfxPayload = (origin, payload) =>
  !payload
    ? ''
    : ['<script src="https://jspm.io/system@0.19.7.js"></script><script type="text/javascript">'
      ,'System.config({ map: { base64: "github:cem2ran/base64-plugin"}, transpiler: "babel", babelOptions: {"stage": 0}});'
      ,'setTimeout(function(){ System.import("' + btoa(payload) +'!base64").catch(function(e){window.top.postMessage({type: "react.play.error", payload: e.stack}, "'+ origin +'")})}, 0);'
      ,'</script>'].join(' ')

const ReactPlay = ({editorCode, sandboxCode, updateCode, error, containerHeight}) =>
  <div style={{flexGrow: 1, flexDirection:'row', display: 'flex'}}>
    <div style={{display: 'flex', flex: 1}}>
      <AceEditor
        mode="javascript"
        theme="chrome"
        width="100%"
        height={(containerHeight)+"px"} //TODO: fix height
        value={editorCode}
        onChange={debounce((text) => updateCode(text), 750)}
        name="react_play_editor"
        onLoad={editor => editor.getSession().setUseWorker(false)}
        editorProps={{
          $blockScrolling: true,
          style:{ position: 'absolute' }
        }}
      />
    </div>
    <div style={{display: 'flex', flex: 1}}>
    {
      error
        ? <Error stacktrace={error}/>
        : <Sandbox
          html={sfxPayload(location.origin, sandboxCode)}
          sandbox={['allow-scripts']}/>
    }
    </div>
  </div>

function Error({stacktrace}) {
  const error = stacktrace.split(":")
  const name = error[0];
  const messages = error.slice(1).join(":").split("|");
  const stack = messages.pop();

  return <pre style={{color: 'crimson'}}>
    {name}
    {messages.join("|").split(":").slice(1).join(":")}
    {stack}
  </pre>
}

export default Dimensions()(ReactPlay)
