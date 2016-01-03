export const encode = (s) => btoa(unescape(encodeURIComponent(s)).replace(/[\u00A0-\u2666]/g, c => '&#' + c.charCodeAt(0) + ';'))

export const decode = (s) => decodeURIComponent(escape(atob(s)))

import 'whatwg-fetch'
export const createShortURL = (URL_SHORTENER_API_KEY) => (URL) =>
  fetch(`https://www.googleapis.com/urlshortener/v1/url?key=${URL_SHORTENER_API_KEY}`, {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      longUrl: URL
    })
  }).then(json)

export const authenticate = (token) => fetch(`https://api.github.com/user?access_token=${token}`).then(json)

export const requestToken = (endpoint, code) => fetch(endpoint + code).then(json)

export const requestGistToken = (app) => (username, password) =>
  fetch('https://api.github.com/authorizations',{
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        "Authorization": "Basic " + btoa(`${username}:${password}`)
      },
      body: JSON.stringify({"scopes":["gist"],"note" : app})
    }).then(json)

export const fetchUser = (login) =>
  fetch(`https://api.github.com/users/${login}`)
  .then(json)

export const updateGist = (token) => ({description, hidden=false, files, id}) =>{
  console.log(description, hidden, files, id)
  return fetch(`https://api.github.com/gists` + (id ? `/${id}` : ''), {
    method: (id ? 'PATCH' : 'POST'),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      "Authorization": "token " + token
    },
    body: JSON.stringify({
      description, 'public': !hidden ,files
    })
  }).then(json)
}


function json(response) {
  return response.json()
}
