/**
 * Created by jonh on 28.10.2016.
 */
import {State} from 'jumpsuit'
import Soundfont from 'soundfont-player'
import midiState from './midi'
import WebMidi from 'webmidi'

const sound_fonts = State('sound_fonts',{
  initial: {
    ready: false,
    instrument: ''
  },

  setKeyValue: (state, payload) => ({
    [payload.key]: payload.value
  })
});

export default sound_fonts;

export function loadSoundFonts(translator) {
  console.log(sound_fonts.getState());
  console.log(midiState.getState());
  let ac = new AudioContext();
  console.log(ac);
  Soundfont.instrument(ac, 'contrabass', {from: 'http://gleitz.github.io/midi-js-soundfonts/MusyngKite/'}).then(
    function (piano) {
      //piano.play('C4').stop(ac.currentTime + 0.5);
      sound_fonts.setKeyValue({key: 'ready', value: true});
      sound_fonts.setKeyValue({key: 'instrument', value: piano});
      //let {in_id} = midi.getState();
      console.log(midiState.getState());
      console.log(midiState);

      //let input = WebMidi.getInputById(input_id);
      //console.log(input);
      piano.listenToMidi(translator, {channel: 0});


    }
  )
}