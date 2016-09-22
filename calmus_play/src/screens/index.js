import { Component } from 'jumpsuit'
import {NotificationContainer} from 'react-notifications';

export default Component({
  render () {
    return (
      <div className='container'>
        <NotificationContainer/>
        <h1>CalMus Play</h1>
          {this.props.children}
      </div>
    )
  }
})
