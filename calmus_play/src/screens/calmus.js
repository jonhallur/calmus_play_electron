/**
 * Created by jonh on 16.9.2016.
 */
import {Component} from 'jumpsuit'
import Option from '../components/input/options'
import uistate from '../state/ui'
import {sendCalmusRequest} from '../state/calmus'
import {getMidiPorts, playComposition} from '../state/midi'
import {playFromList, stopPlayback} from '../state/player'
import Led from '../components/led'
import MidiSelector from '../components/midiselector'
import {NotificationManager} from 'react-notifications'
import ProgressBar from 'react-progressbar'

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
    uistate.setTranspose(0);
    uistate.setSpeed(0);
    uistate.setSize('');
    uistate.setColor('');
    uistate.setInteval('');
    uistate.setPolyphony('');
    uistate.setScale('');
    getMidiPorts();
  },

  onComposeClick(event) {
    event.preventDefault();
    if (this.props.midiOutId === '') {
      NotificationManager.error("Please select MIDI output", "MIDI Error", 3000);
      return
    }
    let values = [
      this.props.transposeValue,
      this.props.speedValue,
      this.props.sizeValue,
      this.props.colorValue,
      this.props.intervalValue,
      this.props.polyphonyValue,
      this.props.scaleValue,
    ];
    let has_empty_strings = values.map(x => x === '');
    if (has_empty_strings.reduce((a,b) => (a || b))) {
      NotificationManager.error("Set all composition parameters", "Some Parameters not set", 5000);
      return
    }
    let valueString = values.join(' ');
    sendCalmusRequest(valueString);

  },

  onPlayClick(event) {
    event.preventDefault();
    playComposition(this.props.midiEvents, this.props.midiOutId, this.props.tempo, this.props.requestString)

  },

  onRandomClick(event) {
    event.preventDefault();
    uistate.setTranspose(getRandomInt(-20,20));
    uistate.setSpeed(getRandomInt(-100,1000));
    uistate.setSize(getRandomInt(1,6));
    uistate.setColor(getRandomInt(1,6));
    uistate.setInteval(getRandomInt(2,7));
    uistate.setPolyphony(getRandomInt(1,4));
    uistate.setScale(getRandomInt(0,32));
  },

  onPlayBadgeClick(event) {
    event.preventDefault();
    let id = event.target.id;
    playFromList(this.props.midiFiles, this.props.players, id, this.props.countdown)
  },

  onStopBadgeClick(event) {
    event.preventDefault();
    let id = event.target.id;
    stopPlayback(this.props.players, id, this.props.countdown)
  },

  render() {
    return (
      <div>
        <div className="panel panel-default">
          <div className="panel-body">
            <form className="form-horizontal">
              <div className="form-group">
                <label className="col-sm-1 control-label" htmlFor="Transpose">Transpose</label>
                <div className="col-sm-9">
                  <input
                    className=""
                    id="transpose"
                    type="range"
                    min="-20"
                    max="20"
                    step="1"
                    value={this.props.transposeValue}
                    onChange={eventValueHandler.bind(this, uistate.setTranspose)}
                  />
                </div>
                <div className="col-sm-2">
                  <input className="form-control" readOnly value={this.props.transposeValue} />
                </div>
              </div>
              <div className="form-group">
                <label className="col-sm-1" htmlFor="speed">Speed</label>
                <div className="col-sm-9">
                  <input
                    className=""
                    id="speed"
                    type="range"
                    min="-100"
                    max="1000"
                    step="1"
                    value={this.props.speedValue}
                    onChange={eventValueHandler.bind(this, uistate.setSpeed)}
                  />
                </div>
                <div className="col-sm-2">
                  <input className="form-control" readOnly value={this.props.speedValue} />
                </div>
              </div>
              <div className="form-group">
                <Option
                  data={this.props.sizeOptions}
                  label="Type"
                  id="size"
                  value={this.props.sizeValue}
                  default_text="Select Composition Type"
                  eventhandler={eventValueHandler.bind(this, uistate.setSize)}
                  offset="1"

                />
                <Option
                  data={this.props.colorOptions}
                  label="Color"
                  id="color"
                  value={this.props.colorValue}
                  default_text="Select Composition Color"
                  eventhandler={eventValueHandler.bind(this, uistate.setColor)}
                  offset="1"
                />
                <Option
                  data={this.props.intervalOptions}
                  label="Interval"
                  id="interval"
                  value={this.props.intervalValue}
                  default_text="Select Harmony Interval"
                  eventhandler={eventValueHandler.bind(this, uistate.setInteval)}
                  offset="2"
                />
                <Option
                  data={this.props.polyphonyOptions}
                  label="Polyphony"
                  id="polyphony"
                  value={this.props.polyphonyValue}
                  default_text="Select Harmony Polyphony"
                  eventhandler={eventValueHandler.bind(this, uistate.setPolyphony)}
                  offset="1"
                />
                <Option
                  data={this.props.scaleOptions}
                  label="Scale"
                  id="scale"
                  value={this.props.scaleValue}
                  default_text="Select Scale"
                  eventhandler={eventValueHandler.bind(this, uistate.setScale)}
                  offset="0"
                />
              </div>
            </form>
            <div className="btn-toolbar">
              <button type="button" className="btn btn-default btn-primary" id="callCalmus" onClick={this.onComposeClick}>Compose</button>
              <button type="button" className="btn btn-default" id="randomSettings" onClick={this.onRandomClick}>Random</button>
            </div>
          </div>
        </div>
      <div className="panel panel-default">
        <div className="panel-body">
          <MidiSelector />
          <div className="form-group col-sm-4">
            <div className="form-group col-sm-6">
              <Led label="MIDI Ready" state={this.props.midiAvailable} />
            </div>
            <div className="form-group col-sm-6">
              <Led label="Ready To Play" state={this.props.compositionReady} />
            </div>
          </div>
        </div>
      </div>
      <div className="panel panel-default">
        <div className="panel-body">
          <ProgressBar completed={(this.props.prog_bar_now / this.props.prog_bar_max)*100}/>
          <ul className="list-group col-sm-4">
            {this.props.midiFiles.map((midiFile, index) => (
              <li className="list-group-item" id={index} key={index}>
                <span id={index} className="badge">
                  <a id={index} href="#" onClick={this.onPlayBadgeClick}>
                    <span id={index} className="white-glyph glyphicon glyphicon-play" aria-hidden="true"></span>
                  </a>
                </span>
                <span id={index} className="badge">
                  <a id={index} href="#" onClick={this.onStopBadgeClick}>
                    <span id={index} className="white-glyph glyphicon glyphicon-stop" aria-hidden="true"></span>
                  </a>
                </span>
                {midiFile.name}
              </li>
            ))}
          </ul>
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
  sizeValue: state.ui_state.sizeValue,
  colorValue: state.ui_state.colorValue,
  intervalValue: state.ui_state.intervalValue,
  polyphonyValue: state.ui_state.polyphonyValue,
  scaleValue: state.ui_state.scaleValue,
  compositionReady: state.calmus_state.compositionReady,
  midiEvents: state.calmus_state.midiEventList,
  midiAvailable: state.midi_state.available,
  midiOutId: state.midi_state.out_id,
  tempo: state.midi_state.tempo,
  requestString: state.calmus_state.requestString,
  midiFiles: state.midi_player.files,
  players: state.midi_player.players,
  prog_bar_max: state.midi_player.current_length,
  prog_bar_now: state.midi_player.current_position,
  countdown: state.midi_player.interval
}))