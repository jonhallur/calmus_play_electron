/**
 * Created by jonh on 15.11.2016.
 */
import {Component} from 'jumpsuit'
import '../pojos/calmusheadanim'
import {updateDrawState} from '../pojos/calmusheadanim'

export default Component({
    componentDidMount() {
      updateDrawState(this.props.waitingForCalmus);
    },

    componentDidUpdate() {
      updateDrawState(this.props.waitingForCalmus);
      console.log("Update");
    },

    render() {
      return (
        <canvas
          id="calmushead"
          width="128px"
          height="128px"
           style={{display: this.props.waitingForCalmus ? 'inline' : 'none'}}
          />
        )
    }
}, (state) => ({
    waitingForCalmus: state.calmus_state.waitingForCalmus,

}))