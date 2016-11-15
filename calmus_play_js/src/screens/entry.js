/**
 * Created by jonh on 29.9.2016.
 */
import {Component} from 'jumpsuit'
import {NotificationContainer} from 'react-notifications'
import Calmus from '../screens/calmus'
import Login from '../screens/login'
import LogInfo from '../screens/loginfo'
import LibraryContainer from '../components/librarycontainer'
import {initializeFirebase} from '../state/firebase'
import uistate from '../state/ui'
import {featureDiscovery} from '../state/features'

export default Component({
  componentDidMount() {
    uistate.debugPrint("entry mounted");
    featureDiscovery();
    //console.log("entry mounted")
    initializeFirebase();
    uistate.debugPrint("firebase initialized")

  },

  render() {
    if (this.props.user) {
      return (
        <div className='container-fluid'>
          <NotificationContainer/>
          <LogInfo />
          <div className="row">
            <div className="col-sm-3">
              <LibraryContainer />
            </div>
            <div className="col-sm-9">
              <Calmus />
            </div>
          </div>
          <div>
            <textarea className="form-control" rows="5" readOnly value={this.props.debugOutput} />
          </div>
        </div>
        )
    }
    else {
      return (
        <div className="container">
          <NotificationContainer/>
          <Login />
          <div>
            <textarea className="form-control" rows="5" readOnly value={this.props.debugOutput} />
          </div>
        </div>
      )
    }
  }
}, (state) => ({
  user: state.firestate.user,
  debugOutput: state.uistate.debugOutput
}));