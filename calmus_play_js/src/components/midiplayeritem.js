/**
 * Created by jonh on 16.11.2016.
 */
import {Component} from 'jumpsuit'
import {playFromList, stopPlayback, createDownload, activatePlaybackIOS} from '../state/player'
import {saveComposition} from '../state/firebase'
import {NotificationManager} from 'react-notifications'
import uistate from '../state/ui'

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
    event.stopPropagation();
    uistate.debugPrint("OnPlayClicked");
    let id = event.target.id;
    if (this.props.isIOS) {
      activatePlaybackIOS(event.nativeEvent);
    }
    playFromList(this.props.midiFiles, this.props.players, id, this.props.countdown, event.nativeEvent);
    event.preventDefault();
  },

  onSaveBadgeClick(event) {
    event.stopPropagation();
    let id = this.props.players.length - 1 - event.target.id;
    let composition = this.props.midiFiles[id];
    saveComposition(composition);
    event.preventDefault();
  },

  onStopBadgeClick(event) {
    event.stopPropagation();
    let id = event.target.id;
    stopPlayback(this.props.players, id, this.props.countdown);
    event.preventDefault();
  },

  onDownloadBadgeClick(event) {
    event.stopPropagation();
    let id = this.props.players.length - 1 - event.target.id;
    let data = this.props.midiFile.data;
    let filename = this.props.midiFile.name;
    createDownload(filename + ".mid", data);
    event.preventDefault();
  },

  onExportBadgeClick(event) {
    event.stopPropagation();
    let fileName = this.props.midiFile.name;
    console.log(fileName);
    createDownload(fileName, this.props.midiFile.cell, "octet/stream")

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
                <span id={index} onClick={this.onPlayBadgeClick}>
                  <span id={index} className="white-glyph glyphicon glyphicon-play" aria-hidden="true"/>
                </span>
              </span>
              <span className="badge player-tools">
                <span id={index} href="#" onClick={this.onStopBadgeClick}>
                  <span id={index} className="white-glyph glyphicon glyphicon-stop" aria-hidden="true"/>
                </span>
              </span>
              <span className="badge player-tools">
                <span id={index} href="#" onClick={this.onDownloadBadgeClick}>
                  <span id={index} className="white-glyph glyphicon glyphicon-save" aria-hidden="true"/>
                </span>
              </span>
              <span className="badge player-tools">
                <span id={index} href="#" onClick={this.onSaveBadgeClick}>
                  <span id={index} className="white-glyph glyphicon glyphicon-floppy-disk" aria-hidden="true"/>
                </span>
              </span>
              {midiFile.cell ?
                <span className="badge player-tools">
                  <span id={index} href="#" onClick={this.onExportBadgeClick}>
                    <span id={index} className="white-glyph glyphicon glyphicon-export" aria-hidden="true"/>
                  </span>
                </span> : null }
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