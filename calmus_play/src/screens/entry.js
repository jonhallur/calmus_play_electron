/**
 * Created by jonh on 29.9.2016.
 */
import {Component} from 'jumpsuit'
import {NotificationContainer} from 'react-notifications'
import Calmus from '../screens/calmus'
import Login from '../screens/login'
import LogInfo from '../screens/loginfo'

export default Component({
  render() {
    if (this.props.user) {
      return (
        <div className='container'>
          <NotificationContainer/>
          <LogInfo />
          <Calmus />
        </div>
        )
    }
    else {
      return (
        <div className="container">
          <NotificationContainer/>
          <Login />
        </div>
      )
    }
  }
}, (state) => ({
  user: state.firebase.user
}))