/**
 * Created by jonh on 16.9.2016.
 */
import {Component} from 'jumpsuit'
import Option from '../components/input/options'
import uistate from '../state/ui'
import {sendCalmusRequest} from '../state/calmus'
import {getMidiPorts, playComposition} from '../state/midi'
import Led from '../components/led'
import MidiSelector from '../components/midiselector'

export function eventValueHandler(func, event) {
  func(event.target.value);
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
    let values = [
      this.props.transposeValue,
      this.props.speedValue,
      this.props.sizeValue,
      this.props.colorValue,
      this.props.intervalValue,
      this.props.polyphonyValue,
      this.props.scaleValue,
      0
    ];
    let valueString = values.join(' ');
    console.log("valuestring =>", valueString);
    sendCalmusRequest(valueString);

  },

  onPlayClick(event) {
    event.preventDefault();
    playComposition(this.props.midiEvents, this.props.midiOutId, this.props.tempo)

  },

  render() {
    return (
      <div>
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
        <div className="form-group col-sm-2">
          <button className="btn btn-default" id="callCalmus" onClick={this.onComposeClick}>Compose</button>
        </div>
        <div className="form-group col-sm-2">
          <button className="btn btn-default" id="playMidi" onClick={this.onPlayClick}>Play</button>
        </div>
      </form>
      <MidiSelector />

      <Led label="MIDI" state={this.props.midiAvailable} />
      <Led label="Ready To Play" state={this.props.compositionReady} />
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
  tempo: state.midi_state.tempo
}))