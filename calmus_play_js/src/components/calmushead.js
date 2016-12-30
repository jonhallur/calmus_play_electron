/**
 * Created by jonh on 15.11.2016.
 */
import {Component} from 'jumpsuit'
import '../pojos/calmusheadanim'
import {updateDrawState} from '../pojos/calmusheadanim'

export default Component({
    componentDidMount() {
      updateDrawState(this.props.waitingForCalmus || this.props.playing);
    },

    componentDidUpdate() {
      updateDrawState(this.props.waitingForCalmus || this.props.playing);
      console.log("Update");
    },

    render() {
      return (
        <canvas
          id="calmushead"
          width="128px"
          height="128px"
           style={{display: (this.props.waitingForCalmus  || this.props.playing) ? 'inline' : 'none'}}
          />
        )
    }
}, (state) => ({
    waitingForCalmus: state.calmus_state.waitingForCalmus,
    playing: state.midi_player.playing
}))