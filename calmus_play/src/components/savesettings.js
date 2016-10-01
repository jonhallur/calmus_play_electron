/**
 * Created by jonh on 30.9.2016.
 */
import {Component} from 'jumpsuit'
import firebase, {saveSettings} from '../state/firebase'

export default Component({
  onSaveIconClick(event) {
    event.preventDefault();
    let settings = {
      name: this.props.settingsName,
      transpose: this.props.transposeValue,
      speed: this.props.speedValue,
      size: this.props.sizeValue,
      color: this.props.colorValue,
      interval: this.props.intervalValue,
      polyphony: this.props.polyphonyValue,
      scale: this.props.scaleValue
    };
    saveSettings(settings, this.props.userUid);
    firebase.setSettingsName('');
  },

  render () {
    let settingsSet = this.props.sizeValue && this.props.colorValue && this.props.intervalValue && this.props.polyphonyValue && this.props.scaleValue;
    return (
      <div className={settingsSet ? 'row' : 'row hidden'}>
        <div className="col-lg-4">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Name to save..."
              value={this.props.settingsName}
              onChange={(x) => firebase.setSettingsName(x.target.value)}
              disabled={!settingsSet}
            />
            <span className="input-group-btn">
              <button
                className="btn btn-default"
                type="button"
                onClick={this.onSaveIconClick}
                disabled={!settingsSet || !this.props.settingsName}
              >
                <span className="glyphicon glyphicon-floppy-disk" aria-hidden="true"></span>
              </button>
            </span>
          </div>
        </div>
      </div>
    )
  }
}, (state) => ({
  transposeValue: state.ui_state.transposeValue,
  speedValue: state.ui_state.speedValue,
  sizeValue: state.ui_state.sizeValue,
  colorValue: state.ui_state.colorValue,
  intervalValue: state.ui_state.intervalValue,
  polyphonyValue: state.ui_state.polyphonyValue,
  scaleValue: state.ui_state.scaleValue,
  settingsName: state.firebase.settingsName,
  userUid: state.firebase.userUid
}))