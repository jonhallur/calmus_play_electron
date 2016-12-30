/**
 * Created by jonh on 26.9.2016.
 */
import {Component} from 'jumpsuit'
import {NotificationManager} from 'react-notifications'
import {startRecording, stopRecording} from '../state/recording'
import {init} from '../pojos/metronome'
import {sendCalmusRequest, missingSettings} from '../state/calmus'
import recording from '../state/recording'
import uistate from '../state/ui'


export default Component({
  componentDidMount() {
    uistate.debugPrint("recorder mounted");

    //console.log("init metro");

    init();
    uistate.debugPrint("metro loaded");

    //console.log("midi recorder mounted")
  },

  onStartRecButtonClick(event) {
    event.preventDefault();
    if(this.props.isRecording) {
      NotificationManager.warning("You are already recording", "Recorder", 3000);
      return;
    }
    if(this.props.in_id === '') {
      NotificationManager.error("No Midi input selected", "Midi Error", 3000);
      return
    }
    if(missingSettings()) {
      return;
    }
    startRecording(this.props.tempo, this.props.metronome, this.props.in_id);
  },

  onStopRecButtonClick(event) {
    event.preventDefault();
    if(!this.props.isRecording) {
      NotificationManager.warning("You are not recording", "Recorder", 3000);
      return
    }
    stopRecording(
      this.props.inputHandle,
      this.props.noteOns,
      this.props.noteOffs,
      this.props.metronome
    );
    uistate.setPolyphony(1);
    sendCalmusRequest(true, true);

  },

  onRecomposeButtonClick(event) {
    event.preventDefault();
    if(!this.props.recordingReady) {
      NotificationManager.warning("You have nothing to recompose", "Recorder", 3000);
      return;
    }
    sendCalmusRequest(true, false);
  },

  render() {
    return (
      <div className="col-sm-6 btn-toolbar">
        <button
          className="btn btn-default"
          onClick={this.onStartRecButtonClick}
          disabled={this.props.waitingForCalmus}
        >
          <span className="glyphicon glyphicon-registration-mark" aria-hidden="true"></span>
          Start Recording
        </button>
        <button
          className={this.props.isRecording ? "btn btn-default" : "hidden" }
          onClick={this.onStopRecButtonClick}>
          <span className="glyphicon glyphicon-stop" aria-hidden="true"></span>
          Stop Recording
        </button>
        <button
          className={this.props.recordingReady ? "btn btn-default" : "hidden"}
          onClick={this.onRecomposeButtonClick}
          disabled={this.props.waitingForCalmus}
        >Recompose
        </button>
          <label className="checkbox-inline">
            <input
              type="checkbox"
              checked={this.props.metronome}
              onChange={e => recording.setKeyValue({key: 'metronome', value: e.target.checked})}
            />Metronome
          </label>
          <div className="col-sm-4">
            <input
              className=""
              id="tempo"
              type="range"
              min="20"
              max="250"
              step="1"
              value={this.props.tempo}
              onChange={e => recording.setKeyValue({key:'tempo', value: e.target.value})}
            />
          </div>
          <div className="col-sm-3">
            <input className="form-control" readOnly value={this.props.tempo} />
          </div>
      </div>

    )
  }
}, (state) => ({
  intervalTime: state.recording.intervalTime,
  metronome: state.recording.metronome,
  isRecording: state.recording.isRecording,
  intervalId: state.recording.intervalId,
  in_id: state.midistate.in_id,
  inputHandle: state.recording.inputHandle,
  noteOns: state.recording.noteOns,
  noteOffs: state.recording.noteOffs,
  tickLength: state.midistate.tick_length,
  recordingReady: state.inputcell.ready,
  tempo: state.recording.tempo,
  waitingForCalmus: state.calmus_state.waitingForCalmus
}));