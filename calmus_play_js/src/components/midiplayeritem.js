/**
 * Created by jonh on 16.11.2016.
 */
import {Component} from 'jumpsuit'
import {playFromList, stopPlayback, createDownload, activatePlaybackIOS} from '../state/player'
import {saveComposition} from '../state/firebase'
import {NotificationManager} from 'react-notifications'

export default Component({
  getInitialState() {
    return {hover: false}
  },

  showDescription() {
    this.setState({hover: true})
  },

  hideDescription()
  {
    this.setState({hover: false})
  },

  onPlayBadgeClick(event) {
    event.preventDefault();
    let id = event.target.id;
    if (this.props.isIOS) {
      activatePlaybackIOS(event);
      NotificationManager.info("Activating IOS audio", "IOS");
    }
    playFromList(this.props.midiFiles, this.props.players, id, this.props.countdown)
  },

  onSaveBadgeClick(event) {
    event.preventDefault();
    let id = this.props.players.length - 1 - event.target.id;
    let composition = this.props.midiFiles[id];
    saveComposition(composition);
  },

  onStopBadgeClick(event) {
    event.preventDefault();
    let id = event.target.id;
    stopPlayback(this.props.players, id, this.props.countdown)
  },

  onDownloadBadgeClick(event) {
    event.preventDefault();
    let id = this.props.players.length - 1 - event.target.id;
    let composition = this.props.midiFiles[id];
    createDownload(composition.name + ".mid", composition.data);
  },

  render () {
    let {midiFile, index, current_position, current_length} = this.props;
    let currentPos = 100 - (current_position / current_length) * 100;
    return (
      <li
        className={this.props.playingId === midiFile.uuid ? 'list-group-item player-line' : 'list-group-item'}
        id={index}
        key={index}
        onMouseEnter={this.showDescription}
        onMouseLeave={this.hideDescription}
        onClick={() => this.setState({hover: !this.state.hover})}
      >
        <div className="">
          <div id={index} className={this.props.playingId === midiFile.uuid ? 'progress' : ''} style={{width: currentPos + "%"}} ></div>
          <div className="player-content">
            <p className="player-title">{midiFile.name}
              <span className="badge player-tools">
                <a id={index} href="#" onClick={this.onPlayBadgeClick}>
                  <span id={index} className="white-glyph glyphicon glyphicon-play" aria-hidden="true"/>
                </a>
              </span>
              <span className="badge player-tools">
                <a id={index} href="#" onClick={this.onStopBadgeClick}>
                  <span id={index} className="white-glyph glyphicon glyphicon-stop" aria-hidden="true"/>
                </a>
              </span>
              <span className="badge player-tools">
                <a id={index} href="#" onClick={this.onDownloadBadgeClick}>
                  <span id={index} className="white-glyph glyphicon glyphicon-save" aria-hidden="true"/>
                </a>
              </span>
              <span className="badge player-tools">
                <a id={index} href="#" onClick={this.onSaveBadgeClick}>
                  <span id={index} className="white-glyph glyphicon glyphicon-floppy-disk" aria-hidden="true"/>
                </a>
              </span>
            </p>
            <p
              className="player-subtitle"
              style={{display: this.state.hover ? "inline" : "none"}}
            >Created {midiFile.created} {midiFile.description}</p>
          </div>
        </div>
      </li>
    )
}}, (state) => ({
  midiFiles: state.midi_player.files,
  players: state.midi_player.players,
  countdown: state.midi_player.interval,
  current_length: state.midi_player.current_length,
  current_position: state.midi_player.current_position,
  playingId: state.midi_player.current_id,
  isIOS: state.features.ios,

}))