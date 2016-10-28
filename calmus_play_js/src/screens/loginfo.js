/**
 * Created by jonh on 29.9.2016.
 */
import {Component} from 'jumpsuit'
import {logOutUser} from '../state/firebase'

export default Component({
  onSignOutClick(event) {
    logOutUser();
  },

  render() {
    return (
      <nav className="navbar navbar-default">
        <div className="container-fluid">
          <div className="navbar-header">
            <a className="navbar-brand" href="#">CALMUS</a>
          </div>
          <p className="navbar-text navbar-right"><a href="#" className="navbar-link" onClick={this.onSignOutClick}>Sign Out ?</a></p>
          <p className="navbar-text navbar-left">Signed in as <a href="#" className="navbar-link">{this.props.userName}</a></p>
        </div>
      </nav>
    )
  }
}, (state) => ({
  userName: state.firebase.userName
}));