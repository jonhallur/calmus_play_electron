/**
 * Created by jonh on 16.9.2016.
 */
import {Component} from 'jumpsuit'
import Option from '../components/input/options'
import ui_state from '../state/ui'
import {sendCalmusRequest} from '../state/calmus'
import {getMidiPorts} from '../state/midi'
import MidiSelector from '../components/midiselector'
import {NotificationManager} from 'react-notifications'
import MidiRecorder from '../components/midirecorder'
import MidiPlayer from '../components/midiplayer'
import SaveSettings from '../components/savesettings'
import SoundFonts from '../components/soundfonts'

export function eventValueHandler(func, event) {
  func(event.target.value);
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default Component({
  componentDidMount() {
    //console.log("Calmus did mount");
    ui_state.setTranspose(0);
    ui_state.setSpeed(850);
    ui_state.setSize('');
    ui_state.setColor('');
    ui_state.setInteval('');
    ui_state.setPolyphony('');
    ui_state.setScale('');
    getMidiPorts();
  },

  getCompositionValues: function () {
    return [
      this.props.transposeValue,
      this.props.speedValue,
      this.props.sizeValue,
      this.props.colorValue,
      this.props.intervalValue,
      this.props.polyphonyValue,
      this.props.scaleValue,
    ];
  },

  onComposeWithInput(event) {
    this.onComposeClick(event, true)
  },

  onComposeClick(event, useInput) {
    event.preventDefault();
    let {addWood, addBrass, addStrings, addPercussion, rhythmComplexity} = this.props;
    let orchestrationList = [
      addWood ? 't': 'nil',
      addBrass ? 't': 'nil',
      addStrings ? 't': 'nil',
      addPercussion ? 't': 'nil',
      rhythmComplexity
    ];
    let orchString = ' ' + orchestrationList.join(' ');
    if (this.props.midiOutId === '') {
      NotificationManager.error("Please select MIDI output", "MIDI Error", 3000);
      return
    }
    var values = this.getCompositionValues();
    let has_empty_strings = values.map(x => x === '');
    if (has_empty_strings.reduce((a,b) => (a || b))) {
      NotificationManager.error("Set all composition parameters", "Some Parameters not set", 5000);
      return
    }
    let valueString = values.join(' ');
    if(useInput) {
      sendCalmusRequest(valueString, orchString, this.props.midiOutId, this.props.recordingsList)
    }
    else {
      sendCalmusRequest(valueString, orchString, this.props.midiOutId);
    }
  },

  onRandomClick(event) {
    event.preventDefault();
    ui_state.setSize(getRandomInt(1,5));
    ui_state.setColor(getRandomInt(1,6));
    ui_state.setInteval(getRandomInt(2,7));
    ui_state.setPolyphony(getRandomInt(1,4));
    ui_state.setScale(getRandomInt(0,32));
  },



  render() {
    return (
      <div>
        <div className="panel panel-default">
          <div className="panel-heading">Settings</div>
          <div className="panel-body">
            <form className="form-horizontal">
              <div className="form-group">
                <label className="col-sm-1 control-label" htmlFor="Transpose">Transpose</label>
                <div className="col-sm-8">
                  <input
                    className=""
                    id="transpose"
                    type="range"
                    min="-20"
                    max="20"
                    step="1"
                    value={this.props.transposeValue}
                    onChange={eventValueHandler.bind(this, ui_state.setTranspose)}
                  />
                </div>
                <div className="col-sm-2">
                  <input className="form-control" readOnly value={this.props.transposeValue} />
                </div>
              </div>
              <div className="form-group">
                <label className="col-sm-1" htmlFor="speed">Speed</label>
                <div className="col-sm-8">
                  <input
                    className=""
                    id="speed"
                    type="range"
                    min="-100"
                    max="1000"
                    step="1"
                    value={this.props.speedValue}
                    onChange={eventValueHandler.bind(this, ui_state.setSpeed)}
                  />
                </div>
                <div className="col-sm-2">
                  <input className="form-control" readOnly value={this.props.speedValue} />
                </div>
              </div>
              <div className="form-group">
                <label className="col-sm-1" htmlFor="speed">Rhythm Complexity</label>
                <div className="col-sm-8">
                  <input
                    className=""
                    id="rhythmComplexity"
                    type="range"
                    min="0.0"
                    max="1.0"
                    step="0.01"
                    value={this.props.rhythmComplexity}
                    onChange={e => ui_state.setKeyValue({key: 'rhythmComplexity', value: e.target.value })}
                  />
                </div>
                <div className="col-sm-2">
                  <input className="form-control" readOnly value={this.props.rhythmComplexity} />
                </div>
              </div>
              <div className="form-group">
                <Option
                  data={this.props.sizeOptions}
                  label="Type"
                  id="size"
                  value={this.props.sizeValue}
                  default_text="Select Composition Type"
                  eventhandler={eventValueHandler.bind(this, ui_state.setSize)}
                  offset="1"

                />
                <Option
                  data={this.props.colorOptions}
                  label="Color"
                  id="color"
                  value={this.props.colorValue}
                  default_text="Select Composition Color"
                  eventhandler={eventValueHandler.bind(this, ui_state.setColor)}
                  offset="1"
                />
                <Option
                  data={this.props.intervalOptions}
                  label="Interval"
                  id="interval"
                  value={this.props.intervalValue}
                  default_text="Select Harmony Interval"
                  eventhandler={eventValueHandler.bind(this, ui_state.setInteval)}
                  offset="2"
                />
                <Option
                  data={this.props.polyphonyOptions}
                  label="Polyphony"
                  id="polyphony"
                  value={this.props.polyphonyValue}
                  default_text="Select Harmony Polyphony"
                  eventhandler={eventValueHandler.bind(this, ui_state.setPolyphony)}
                  offset="1"
                />
                <Option
                  data={this.props.scaleOptions}
                  label="Scale"
                  id="scale"
                  value={this.props.scaleValue}
                  default_text="Select Scale"
                  eventhandler={eventValueHandler.bind(this, ui_state.setScale)}
                  offset="0"
                />
              </div>
              <label className="checkbox-inline">
                <input
                  type="checkbox"
                  checked={this.props.addWood}
                  onChange={e => ui_state.setKeyValue({key: 'addWood', value: e.target.checked})}
                />Add Wood to Strings
              </label>&nbsp;&nbsp;&nbsp;
              <label className="checkbox-inline">
                <input
                  type="checkbox"
                  checked={this.props.addBrass}
                  onChange={e => ui_state.setKeyValue({key: 'addBrass', value: e.target.checked})}
                />Add Brass to Strings
              </label>&nbsp;&nbsp;&nbsp;
              <label className="checkbox-inline">
                <input
                  type="checkbox"
                  checked={this.props.addStrings}
                  onChange={e => ui_state.setKeyValue({key: 'addStrings', value: e.target.checked})}
                />Add Strings to Wood
              </label>&nbsp;&nbsp;&nbsp;
              <label className="checkbox-inline">
                <input
                  type="checkbox"
                  checked={this.props.addPercussion}
                  onChange={e => ui_state.setKeyValue({key: 'addPercussion', value: e.target.checked})}
                />Add Percussion to Orchestration
              </label>
            </form>
            <div className="btn-toolbar">
              <button type="button" className="btn btn-default btn-primary" onClick={this.onComposeClick}>Compose</button>
              <button type="button" className="btn btn-default" onClick={this.onRandomClick}>Random</button>
              <button type="button" className={this.props.recordingReady ? "btn btn-default" : "hidden"} onClick={this.onComposeWithInput}>ComposeInput</button>
              <SaveSettings />
            </div>

          </div>
        </div>
      <div className="panel panel-default">
        <div className="panel-heading">MIDI</div>
        <div className="panel-body">
          <MidiSelector />
          <MidiRecorder />
          <SoundFonts />
        </div>
      </div>
      <div className="panel panel-default">
        <div className="panel-heading">MIDI Player</div>
        <div className="panel-body">
          <MidiPlayer/>
        </div>
      </div>
    </div>

    )
  }
}, (state) => ({
  sizeOptions: state.ui_state.size,
  colorOptions: state.ui_state.color,
  intervalOptions: state.ui_state.interval,
  polyphonyOptions: state.ui_state.polyphony,
  scaleOptions: state.ui_state.scale,
  transposeValue: state.ui_state.transposeValue,
  speedValue: state.ui_state.speedValue,
  rhythmComplexity: state.ui_state.rhythmComplexity,
  sizeValue: state.ui_state.sizeValue,
  colorValue: state.ui_state.colorValue,
  intervalValue: state.ui_state.intervalValue,
  polyphonyValue: state.ui_state.polyphonyValue,
  scaleValue: state.ui_state.scaleValue,
  addWood: state.ui_state.addWood,
  addBrass: state.ui_state.addBrass,
  addStrings: state.ui_state.addStrings,
  addPercussion: state.ui_state.addPercussion,
  midiOutId: state.midi_state.out_id,
  tempo: state.midi_state.tempo,
  recordingsList: state.midi_recording.eventList,
  recordingReady: state.midi_recording.ready

}))