/**
 * Created by jonh on 29.9.2016.
 */
import {Component} from 'jumpsuit'
import {NotificationContainer} from 'react-notifications'
import Calmus from '../screens/calmus'
import Login from '../screens/login'
import LogInfo from '../screens/loginfo'
import SettingsList from '../components/settingslist'
import {initializeFirebase} from '../state/firebase'

export default Component({
  componentDidMount() {
    //console.log("entry mounted")
    initializeFirebase();
  },

  render() {
    if (this.props.user) {
      return (
        <div className='container-fluid'>
          <NotificationContainer/>
          <LogInfo />
          <div className="row">
            <div className="col-sm-3">
              <SettingsList />
            </div>
            <div className="col-sm-9">
              <Calmus />
            </div>
          </div>
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
}));