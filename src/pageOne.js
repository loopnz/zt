import './styles/index.scss'
import React from 'react'
import { Component } from 'react'
import { render } from 'react-dom'
import * as Sentry from '@sentry/browser'
import { init, captureMessage } from '@sentry/browser'

init({
  dsn: 'http://0753074379354762b0cadf1bbf88a050@192.168.99.100:9000/2'
  // ...
})

class Button extends Component {
  componentDidCatch(error, errorInfo) {
    Sentry.withScope(scope => {
      Object.keys(errorInfo).forEach(key => {
        scope.setExtra(key, errorInfo[key])
      })
      Sentry.captureException(error)
    })
  }
  render() {
    return (
      <div className="div">
        <h1>Hello world!</h1>
      </div>
    )
  }
}

render(<Button />, document.getElementById('app'))
