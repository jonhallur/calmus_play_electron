/**
 * Created by jonh on 26.9.2016.
 */
import {Component} from 'jumpsuit'
import {NotificationManager} from 'react-notifications'
import {startRecording, stopRecording} from '../state/recording'


export default Component({
  onStartRecButtonClick(event) {
    event.preventDefault();
    if(this.props.isRecording) {
      NotificationManager.warning("You are already recording", "Recorder", 2000);
      return;
    }
    if(this.props.in_id === '') {
      NotificationManager.error("No Midi input selected", "Midi Error", 3000);
      return
    }
    startRecording(this.props.intervalTime, this.props.metronome, this.props.sounds, this.props.in_id);
  },

  onStopRecButtonClick(event) {
    event.preventDefault();
    if(!this.props.isRecording) {
      NotificationManager.warning("You are not recording", "Recorder", 2000);
      return
    }
    stopRecording(
      this.props.intervalId,
      this.props.inputHandle,
      this.props.noteOns,
      this.props.noteOffs,
      this.props.tickLength
    );
  },

  render() {
    return (
      <div className="col-sm-6 btn-toolbar">
          <button className="btn btn-default" onClick={this.onStartRecButtonClick}>
            <span className="white-glyph glyphicon glyphicon-registration-mark" aria-hidden="true"></span>
            Start Recording
          </button>
          <button className="btn btn-default" onClick={this.onStopRecButtonClick}>
            <span className="white-glyph glyphicon glyphicon-stop" aria-hidden="true"></span>
            Stop Recording
          </button>
      </div>
    )
  }
}, (state) => ({
  intervalTime: state.midi_recording.intervalTime,
  metronome: state.midi_recording.metronome,
  isRecording: state.midi_recording.isRecording,
  intervalId: state.midi_recording.intervalId,
  sounds: state.midi_recording.sounds,
  in_id: state.midi_state.in_id,
  inputHandle: state.midi_recording.inputHandle,
  noteOns: state.midi_recording.noteOns,
  noteOffs: state.midi_recording.noteOffs,
  tickLength: state.midi_state.tick_length
}));