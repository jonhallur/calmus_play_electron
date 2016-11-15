/**
 * Created by jonh on 14.11.2016.
 */
import {Component} from 'jumpsuit'
import SettingsList from '../components/settingslist'
import uistate from '../state/ui'

export default Component({
  onTabClick(event, true_id) {
    event.preventDefault();
    let libraries = ['settingsActive', 'inputcellsActive', 'compositionsActive'];
    for(let i=0;i < 3; i++) {
      if(true_id === i) {
        uistate.setKeyValue({key: libraries[i], value: true})
      }
      else {
        uistate.setKeyValue({key: libraries[i], value: false})
      }
    }
  },

  render () {
    let {settingsActive, inputcellsActive, compositionsActive} = this.props;
    return (
      <div className="panel panel-default">
        <div className="panel-heading">Library</div>
        <div className="panel-body">
          <ul className="nav nav-tabs" role="tablist">
            <li role="presentation" className={settingsActive ? "active" : ""}>
              <a href="" role="tab" data-toggle="tab" onClick={(event) => this.onTabClick(event, 0)}>Settings</a>
            </li>
            <li role="presentation" className={inputcellsActive ? "active" : ""}>
              <a href="" role="tab" data-toggle="tab" onClick={(event) => this.onTabClick(event, 1)}>Input Cells</a>
            </li>
            <li role="presentation" className={compositionsActive ? "active" : ""}>
              <a href="" role="tab" data-toggle="tab" onClick={(event) => this.onTabClick(event, 2)}>Compositions</a>
            </li>
          </ul>

          <div className="tab-content">
            <div role="tabpanel" className={settingsActive ? "tab-pane active" : "tab-pane" } id="settings">
              <SettingsList type="savedSettingsList"/>
            </div>
            <div role="tabpanel" className={inputcellsActive ? "tab-pane active" : "tab-pane" } id="inputcells">
              <SettingsList type="savedInputcellsList"/>
            </div>
            <div role="tabpanel" className={compositionsActive ? "tab-pane active" : "tab-pane" } id="compositions">

            </div>
          </div>
        </div>
      </div>
    )
}}, (state) => ({
  settingsActive: state.uistate.settingsActive,
  inputcellsActive: state.uistate.inputcellsActive,
  compositionsActive: state.uistate.compositionsActive,
}))