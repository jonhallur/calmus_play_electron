/**
 * Created by jonh on 30.9.2016.
 */
import {Component} from 'jumpsuit'

import uistate from '../state/ui'
import MidiPlayerItem from './midiplayeritem'

export default Component({
  componentDidMount() {
    uistate.debugPrint("player mounted");
    //console.log("midiplayer mounted");
  },

  render() {
    let reverseList = [];
    this.props.midiFiles.map(x => reverseList.push(x));
    reverseList.reverse();
    return (
    <div className="panel panel-default">
      <div className="panel-heading">MIDI Player</div>
      <div className="panel-body">
        <div className="col-sm-12">
          <ul className="list-group midi-player">
            {reverseList.map((midiFile, index) => (
              <MidiPlayerItem midiFile={midiFile} index={index} key={index}/>
            ))}
          </ul>
        </div>
      </div>
    </div>
    )
  }
}, (state) => ({
  midiFiles: state.midi_player.files,
  players: state.midi_player.players,
  countdown: state.midi_player.interval,
}))