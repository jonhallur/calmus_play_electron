import { Component } from 'jumpsuit'
import firebase, {createUser, loginUser} from '../state/firebase'
import uistate from '../state/ui'

export default Component({
  componentDidMount() {
    uistate.debugPrint("login mounted")
    //console.log("Login mounted");
  },

  navLoginClick (event) {
    event.preventDefault();
    firebase.setShowLogin(true);
  },

  navSignupClick (event) {
    event.preventDefault();
    firebase.setShowLogin(false);
  },

  loginClick (event) {
    event.preventDefault();
    let email = document.getElementById('loginEmail').value;
    let password = document.getElementById('loginPassword').value;
    loginUser(email, password);
  },

  signupClick (event) {
    event.preventDefault();
    let email = document.getElementById('signupEmail').value;
    let password = document.getElementById('signupPassword').value;
    createUser(email, password);
  },

  render () {
    return (
      <div className='container'>
        <ul className="nav nav-tabs">
          <li role="presentation" className={this.props.showLogin ? 'active' : ''}>
            <a href="#login" aria-controls="login" role="tab" data-toggle="tab" onClick={this.navLoginClick}>Log In</a>
          </li>
          <li role="presentation" className={this.props.showLogin ? '' : 'active'}>
            <a href="#signup" aria-controls="signup" role="tab" data-toggle="tab" onClick={this.navSignupClick}>Sign Up</a>
          </li>
        </ul>
        <div className="tab-content">
          <div role="tabpanel" className={this.props.showLogin ? 'tab-pane active' : 'tab-pane'} id="login">
            <h1>Please Log In</h1>
            <form onSubmit={this.loginClick}>
              <div className="form-group">
                <label htmlFor="loginEmail">Email address</label>
                <input type="email" className="form-control" id="loginEmail" placeholder="Email" />
              </div>
              <div className="form-group">
                <label htmlFor="loginPassword">Password</label>
                <input type="password" className="form-control" id="loginPassword" placeholder="Password" />
              </div>
              <button type="submit" className="btn btn-default">Log In</button>
            </form>
          </div>
          <div role="tabpanel" className={this.props.showLogin ? 'tab-pane' : 'tab-pane active'} id="signup">
            <h1>Signup</h1>
            <form onSubmit={this.signupClick}>
              <div className="form-group">
                <label htmlFor="signupEmail">Email address</label>
                <input type="email" className="form-control" id="signupEmail" placeholder="Email" />
              </div>
              <div className="form-group">
                <label htmlFor="signupPassword">Password</label>
                <input type="password" className="form-control" id="signupPassword" placeholder="Password" />
              </div>
              <button type="submit" className="btn btn-default">Sign Up</button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}, (state) => ({
  showLogin: state.firebase.showLogin,
  initialized: state.firebase.initialized,
  userName: state.firebase.userName
}));
