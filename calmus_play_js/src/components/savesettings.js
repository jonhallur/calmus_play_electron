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
  transposeValue: state.uistate.transposeValue,
  speedValue: state.uistate.speedValue,
  sizeValue: state.uistate.sizeValue,
  colorValue: state.uistate.colorValue,
  intervalValue: state.uistate.intervalValue,
  polyphonyValue: state.uistate.polyphonyValue,
  scaleValue: state.uistate.scaleValue,
  settingsName: state.firebase.settingsName,
  userUid: state.firebase.userUid
}))