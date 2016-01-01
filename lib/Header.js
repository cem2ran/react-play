import React, {Component, PropTypes} from 'react';

import ToolTip from 'react-portal-tooltip'
import GithubCorner from 'react-github-corner'

import {createShortURL} from './utils'

export default class Header extends Component {

  static propTypes = {
    URL_SHORTENER_API_KEY: PropTypes.string
  }

  state = {
    shortUrl: '',
    showTooltip: false
  }

  hideTooltip(){
    if(this.state.showTooltip)
    this.setState({showTooltip: false})
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

  render(){
    return <header style={{textAlign: 'center', borderBottom: '1px dashed #f2f2f2'}}>
      <span style={{float: 'left', padding: 5, fontWeight: 100}}>
        React Play
      </span>
      {this.props.URL_SHORTENER_API_KEY &&
        <button id="url"
          style={{
            border: 0,
            padding: '8px',
            background: 'none',
            'fontWeight': 300,
            cursor: 'pointer'
          }}
          onMouseLeave={this.hideTooltip.bind(this)} onClick={this.getShortURL.bind(this)}>
          Short URL
        </button>
      }
      <ToolTip active={this.state.showTooltip} position="bottom" arrow="center" parent="#url">
        <div>
          <p>share away!</p>
          <span>
            <input value={this.state.shortUrl} readOnly/>
          </span>
        </div>
      </ToolTip>
      <GithubCorner width="60" height="60" href="https://github.com/cem2ran/react-play" />
    </header>
  }
}
