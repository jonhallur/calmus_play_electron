/**
 * Created by jonh on 28.10.2016.
 */
import {Component} from 'jumpsuit'
import {loadSoundFonts} from '../state/soundfont'

export default Component({
  componentDidMount() {
    //loadSoundFonts();
  },

  connectSoundFonts(event) {
    event.preventDefault();
    loadSoundFonts(this.props.translator)
  },

  render () {
    return (
      <div>
        {(this.props.in_id !== '') ?
          <button
            onClick={this.connectSoundFonts}
          >Connect</button> : ''}
      </div>
    )
  }
}, (state) => ({
  sf_ready: state.sound_fonts.ready,
  in_id: state.midi_state.in_id,
  translator: state.midi_player.translator,
}))