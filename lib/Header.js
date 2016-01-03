import React, {Component, PropTypes} from 'react';

import ToolTipButton from './ToolTipButton/index'
import ToolTipButtonStyle from './ToolTipButton/style'

import GithubCorner from 'react-github-corner'

import {createShortURL, requestGistToken, fetchUser, requestToken, authenticate} from './utils'

const USER_STORAGE_KEY = 'react.play.user'

const gistUrl = (user, id) => `https://gist.github.com/${user}/${id}`

export default class Header extends Component {

  static propTypes = {
    URL_SHORTENER_API_KEY: PropTypes.string,
    GITHUB_CLIENT_ID: PropTypes.string,
    GITHUB_TOKEN_ENDPOINT: PropTypes.string
  }

  constructor(props){
    super(props)

    const {user, token} = JSON.parse(localStorage.getItem(USER_STORAGE_KEY)) || {}

    this.state = {
      shortUrl: '',
      showTooltip: false,
      showAuthTooltip: false,
      user, token,
      username: null, password: null,
      description: null
    }
    window.addEventListener('message', (event) =>{
      if(event.data.type === 'react.play.token') {
        requestToken(props.GITHUB_TOKEN_ENDPOINT, event.data.payload).then(({token}) => {
          authenticate(token).then(user => {
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify({user, token}))
            this.setState({
              user, token
            })
          })
        })
      }
    });
    //get and set gist details if exists
  }

  hideTooltip(key){
    if(this.state[key])
    this.setState({[key]: false})
  }

  getShortURL(){
    createShortURL(this.props.URL_SHORTENER_API_KEY)(location.href)
    .then(({id, err}) => {
      if(id){
        this.setState({
          showTooltip: true,
          shortUrl: id
        })
      }
    })
  }

  handleInput(key, event){
    console.log(key, event)
    this.setState({[key]: event.target.value})
  }

  handleLoginClick(){
    window.open(`https://github.com/login/oauth/authorize?client_id=${this.props.GITHUB_CLIENT_ID}&scope=gist`)
  }

  render(){
    return <header style={{textAlign: 'center', flexBasis: 28, borderBottom: '1px dashed #f2f2f2'}}>
      {
        this.state.user
        ? <img style={{width: 28, float: 'left'}} src={this.state.user.avatar_url}/>
        : this.props.GITHUB_CLIENT_ID
          && <button style={ToolTipButtonStyle} onClick={this.handleLoginClick.bind(this)}>login</button>
      }
      {this.state.token &&
        <ToolTipButton id='save_gist' buttonText='save gist' isShown={this.props.showGistTooltip}
          onClick={this.props.saveGist.bind(this, this.state.token)} hide={this.props.hideGistTooltip.bind(this)}>
          <p>share away!</p>
          <span>
            <input value={gistUrl(this.state.user.login, this.props.gistId)} readOnly/>
          </span>
        </ToolTipButton>
      }
      {this.props.URL_SHORTENER_API_KEY &&
        <ToolTipButton id='short_url' buttonText='Shorten url' isShown={this.state.showTooltip}
          onClick={this.getShortURL.bind(this)} hide={this.hideTooltip.bind(this, 'showTooltip')}>
          <p>share away!</p>
          <span>
            <input value={this.state.shortUrl} readOnly/>
          </span>
        </ToolTipButton>
      }
      <div style={{backgroundImage:'./logo.svg', paddingTop: 5, fontWeight: 100, marginRight: 140}}>
        React Play
      </div>
      <GithubCorner width="60" height="60" href="https://github.com/cem2ran/react-play" />
    </header>
  }
}
