/**
 * Created by jonh on 30.9.2016.
 */
import {Component} from 'jumpsuit'
import {playFromList, stopPlayback, createDownload} from '../state/player'
import uistate from '../state/ui'

export default Component({
  componentDidMount() {
    uistate.debugPrint("player mounted");
    //console.log("midiplayer mounted");
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

  onDownloadBadgeClick(event) {
    event.preventDefault();
    //let id = event.target.id;
    let id = this.props.players.length - 1 - event.target.id;
    let composition = this.props.midiFiles[id];
    createDownload(composition.name + ".mid", composition.data);
  },

  render() {
    let currentPos = 100 - (this.props.current_position / this.props.current_length) * 100;
    let reverseList = [];
    this.props.midiFiles.map(x => reverseList.push(x));
    reverseList.reverse();
    return (
      <div className="col-sm-12">
        <ul className="list-group midi-player">
          {reverseList.map((midiFile, index) => (
            <li className={this.props.playingId === midiFile.uuid ? 'list-group-item player-line' : 'list-group-item'} id={index} key={index}>
              <div className="">
                <div id={index} className={this.props.playingId === midiFile.uuid ? 'progress' : ''} style={{width: currentPos + "%"}} ></div>
                <div className="player-content">
                  {midiFile.name}
                  <span className="badge player-tools">
                  <a id={index} href="#" onClick={this.onPlayBadgeClick}>
                    <span id={index} className="white-glyph glyphicon glyphicon-play" aria-hidden="true"></span>
                  </a>
                </span>
                  <span className="badge player-tools">
                  <a id={index} href="#" onClick={this.onStopBadgeClick}>
                    <span id={index} className="white-glyph glyphicon glyphicon-stop" aria-hidden="true"></span>
                  </a>
                </span>
                  <span className="badge player-tools">
                  <a id={index} href="#" onClick={this.onDownloadBadgeClick}>
                    <span id={index} className="white-glyph glyphicon glyphicon-save" aria-hidden="true"></span>
                  </a>
                </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}, (state) => ({
  midiFiles: state.midi_player.files,
  players: state.midi_player.players,
  countdown: state.midi_player.interval,
  current_length: state.midi_player.current_length,
  current_position: state.midi_player.current_position,
  playingId: state.midi_player.current_id
}))