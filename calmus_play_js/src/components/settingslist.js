/**
 * Created by jonh on 30.9.2016.
 */
import {Component} from 'jumpsuit'
import ui from '../state/ui'
import {deleteSettings} from '../state/firebase'

export default Component({
  onSettingsNameClick (event) {
    event.preventDefault();
    let key = event.target.id;
    for(let setting of this.props.savedSettingsList) {
      if(setting.uid === key) {
        let {transpose, speed, size, color, interval, polyphony, scale} = setting;
        ui.setTranspose(transpose);
        ui.setSpeed(speed);
        ui.setSize(size);
        ui.setColor(color);
        ui.setInteval(interval);
        ui.setPolyphony(polyphony);
        ui.setScale(scale);
        break;
      }
    }
  },

  onRemoveBadgeClick(event) {
    event.preventDefault();
    event.stopPropagation();
    let id = event.target.id;
    deleteSettings(id, this.props.userUid);
  },

  render () {
    return (
      <div className="panel panel-default">
        <div className="panel-heading">Saved Settings</div>
        <div className="panel-body">
          <div className="list-group">
            {this.props.savedSettingsList.map((settings, index) => (
              <a className="list-group-item" id={settings.uid} key={settings.uid} onClick={this.onSettingsNameClick}>
                    {settings.name}
                  <span id={settings.uid} className="badge">
                    <span id={settings.uid} className="white-glyph glyphicon glyphicon-remove" aria-hidden="true" onClick={this.onRemoveBadgeClick}></span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    )
  }
}, (state) => ({
  savedSettingsList: state.firebase.savedSettingsList,
  userUid: state.firebase.userUid
}))