import React, {Component, PropTypes} from 'react';

import Header from './Header'
import ReactPlay from './ReactPlay'
import {updateGist, encode, decode} from './utils'

const DEFAULT_STORAGE_KEY = 'react.play'

const DEFAULT_HTML_FILENAME = 'react.play.html'
const DEFAULT_JS_FILENAME = 'index.js'

const htmlScaffold = (filename, body='') => `<!DOCTYPE html><script src="https://jspm.io/system@0.19.js"></script><script>System.config({transpiler: "babel"});System.import("./${filename}");</script><body>${body}</body></html>`

export default class App extends Component{
  static propTypes = {
    STORAGE_KEY: PropTypes.string,
    URL_SHORTENER_API_KEY: PropTypes.string,
    code: PropTypes.string
  }
  constructor(props){
    super(props)
    const saved_code = localStorage.getItem(this.props.STORAGE_KEY || DEFAULT_STORAGE_KEY)
    const code = (location.hash && decode(location.hash.slice(1))) || saved_code && decode(saved_code) || props.code || '//write your code here...'
    if(code) location.hash = encode(code)

    this.state = {
      html: htmlScaffold(DEFAULT_JS_FILENAME),
      editorCode: code,
      sandboxCode: code,
      gistId: null,
      showGistTooltip: false,
      error: null,
      evaluate: false
    }
  }

  componentDidMount(){
    window.addEventListener('message', (event) => {
      if(event.data.type === 'react.play.error')
        this.onError(event.data.payload)
    }, false);
  }

  componentWillUnmount(){
    window.removeEventListener(this.onError.bind(this))
  }

  onError(error){
    this.setState({
      error
    })
  }

  onChange(code) { if(this.state.code != code){
    const sandboxCode = this.state.evaluate ? code : this.state.sandboxCode
    this.setState({
      editorCode: code,
      error: null,
      sandboxCode
    })
    localStorage.setItem(this.props.STORAGE_KEY || DEFAULT_STORAGE_KEY, encode(code))
    location.hash = encode(code)
  }}

  evaluate(){
    this.setState({
      sandboxCode: this.state.editorCode
    })
  }

  onEvaluateChange(){
    this.setState({
      evaluate: !this.state.evaluate,
      sandboxCode: this.state.editorCode
    })
  }

  saveGist(token){
    updateGist(token)({
      description: this.props.description || 'A React Play gist: https://react-play.surge.sh',
      files: {
        [DEFAULT_JS_FILENAME]: {
          content: this.state.editorCode
        },
        [DEFAULT_HTML_FILENAME]: {
          content: this.state.html
        }
      }
    }).then((response) => {
      console.log(response)
      this.setState({
        gistId: response.url.split('/').slice(-1)[0],
        showGistTooltip: true
      })
    }).catch(err => {
      console.log("error saving gist", err)
    })
  }

  handleCtrlEnter(e){
    if((e.key === 'Enter') && e.ctrlKey){
      e.preventDefault();
      this.evaluate()
    }
  }

  render(){
    return <div
        style={{display: 'flex', flexDirection: 'column', position: 'absolute', height: '100%', width: '100%'}}
        onKeyPress={this.handleCtrlEnter.bind(this)}
        >
      <Header
        URL_SHORTENER_API_KEY={this.props.URL_SHORTENER_API_KEY}
        GITHUB_CLIENT_ID={this.props.GITHUB_CLIENT_ID}
        GITHUB_TOKEN_ENDPOINT={this.props.GITHUB_TOKEN_ENDPOINT}
        saveGist={this.saveGist.bind(this)}
        gistId={this.state.gistId}
        showGistTooltip={this.state.showGistTooltip}
        hideGistTooltip={() => {
          this.setState({
            showGistTooltip: false
          })
        }}
      />
    <ReactPlay
      editorCode={this.state.editorCode}
      sandboxCode={this.state.sandboxCode}
      error={this.state.error}
      updateCode={this.onChange.bind(this)}
    />
  <div style={{display: 'flex', flexBasis: 25, background: '#f2f2f2', paddingTop: 5}}>
      <input type="checkbox"
        name="evaluate"
        checked={this.state.evaluate}
        onChange={this.onEvaluateChange.bind(this)} />
      <label htmlFor="evaluate" style={{fontSize: 12}}>
        <strong>auto-evaluate</strong> (ctrl+enter to evaluate)
      </label>
    </div>

    </div>
  }
}
