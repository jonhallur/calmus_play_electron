/**
 * Created by jonh on 16.9.2016.
 */
import {Component} from 'jumpsuit'
import Option from '../components/input/options'
import ui_state from '../state/ui'
import {sendCalmusRequest} from '../state/calmus'
import {getMidiPorts} from '../state/midi'
import MidiSelector from '../components/midiselector'
import MidiRecorder from '../components/midirecorder'
import MidiPlayer from '../components/midiplayerlist'
import SaveSettings from '../components/savesettings'
import SoundFonts from '../components/soundfonts'
import {loadSoundFonts} from "../state/soundfont";
import InputCell from '../components/inputcell'
import CalmusHead from '../components/calmushead'

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
    ui_state.setSpeed(0);
    ui_state.setSize('');
    ui_state.setColor('');
    ui_state.setInteval('');
    ui_state.setPolyphony('');
    ui_state.setScale('');
    ui_state.debugPrint("Calmus has mounted");
    getMidiPorts();
    ui_state.debugPrint("MidiPorts");
    loadSoundFonts();
    ui_state.debugPrint("Soundfonts");

  },

  onRecomposeButtonClick(event) {
    this.onComposeClick(event, true)
  },

  onComposeClick(event, recompose=false) {
    event.preventDefault();
    let useInput = false;
    sendCalmusRequest(useInput, recompose)
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
        <CalmusHead />
        <SoundFonts/>
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
                    min="-20"
                    max="20"
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
                <label className="col-sm-1" htmlFor="rhythmComplexity">Rhythm Complexity</label>
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
                  checked={this.props.addStrings}
                  onChange={e => ui_state.setKeyValue({key: 'addStrings', value: e.target.checked})}
                />String Section
              </label>&nbsp;&nbsp;&nbsp;
              <label className="checkbox-inline">
                <input
                  type="checkbox"
                  checked={this.props.addWood}
                  onChange={e => ui_state.setKeyValue({key: 'addWood', value: e.target.checked})}
                />Wood Section
              </label>&nbsp;&nbsp;&nbsp;
              <label className="checkbox-inline">
                <input
                  type="checkbox"
                  checked={this.props.addBrass}
                  onChange={e => ui_state.setKeyValue({key: 'addBrass', value: e.target.checked})}
                />Brass Section
              </label>&nbsp;&nbsp;&nbsp;
              <label className="checkbox-inline">
                <input
                  type="checkbox"
                  checked={this.props.addPercussion}
                  onChange={e => ui_state.setKeyValue({key: 'addPercussion', value: e.target.checked})}
                />Percussion Section
              </label>

              <label className="checkbox-inline">
                <input
                  type="checkbox"
                  checked={this.props.melodyStrong}
                  onChange={e => ui_state.setKeyValue({key: 'melodyStrong', value: e.target.checked})}
                />Melody Strong
              </label>
              <label className="checkbox-inline">
                <input
                  type="checkbox"
                  checked={this.props.harmonyStrong}
                  onChange={e => ui_state.setKeyValue({key: 'harmonyStrong', value: e.target.checked})}
                />Harmony Strong
              </label>
            </form>
            <div className="btn-toolbar">
              <button
                type="button"
                className="btn btn-default btn-primary"
                onClick={this.onComposeClick}
                disabled={this.props.waitingForCalmus}
              >Compose</button>
              <button type="button" className="btn btn-default" onClick={this.onRandomClick}>Random</button>
              <SaveSettings />
            </div>

          </div>
        </div>
      <InputCell />
      <MidiPanel show={this.props.showMidiPanel} /> <MidiPlayer/>
    </div>

    )
  }
}, (state) => ({
  sizeOptions: state.uistate.size,
  colorOptions: state.uistate.color,
  intervalOptions: state.uistate.interval,
  polyphonyOptions: state.uistate.polyphony,
  scaleOptions: state.uistate.scale,
  transposeValue: state.uistate.transposeValue,
  speedValue: state.uistate.speedValue,
  rhythmComplexity: state.uistate.rhythmComplexity,
  sizeValue: state.uistate.sizeValue,
  colorValue: state.uistate.colorValue,
  intervalValue: state.uistate.intervalValue,
  polyphonyValue: state.uistate.polyphonyValue,
  scaleValue: state.uistate.scaleValue,
  addWood: state.uistate.addWood,
  addBrass: state.uistate.addBrass,
  addStrings: state.uistate.addStrings,
  addPercussion: state.uistate.addPercussion,
  melodyStrong: state.uistate.melodyStrong,
  harmonyStrong: state.uistate.harmonyStrong,
  midiOutId: state.midistate.out_id,
  tempo: state.midistate.tempo,
  recordingsList: state.recording.eventList,
  debugOutput: state.uistate.debugOutput,
  showMidiPanel: state.features.midi,
  waitingForCalmus: state.calmus_state.waitingForCalmus,


}))

const MidiPanel = (props) => (
  <div className={props.show ? "panel panel-default" : "hidden"}>
    <div className="panel-heading">MIDI</div>
    <div className="panel-body">
      <MidiSelector />
      <MidiRecorder />
    </div>
  </div>
);