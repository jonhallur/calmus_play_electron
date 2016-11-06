/**
 * Created by jonh on 28.10.2016.
 */
import {State} from 'jumpsuit'
import Soundfont from 'soundfont-player'
import midistate from './midi'
import WebMidi from 'webmidi'

var selected_midi_output;

class MIDI2SFTranslator {
  constructor() {
    for(let channel=0; channel < 16; channel++) {
      this[channel] = {}
    }
  }
  send(paramList) {
    if (selected_midi_output === undefined) {
      let {out_id} = midistate.getState();
      if (out_id !== ''){
        selected_midi_output = WebMidi.getOutputById(out_id)._midiOutput;
        selected_midi_output.send(paramList);
      }
    }
    else {
      selected_midi_output.send(paramList)
    }
    let msg = {};
    let status = paramList[0] >> 4;
    msg.channel = paramList[0] & 15;
    msg.key = paramList[1];
    msg.velocity = paramList[2];
    if (this[msg.channel].onmidimessage !== undefined) {

      if (status === 8) {
        msg.messageType = 'noteoff'
      }
      else if (status === 9) {
        msg.messageType = 'noteon'
      }
      else {
        console.log('unknown status', status);
        return
      }
      this[msg.channel].onmidimessage(msg);
    }
  }
}

var filenames = [
  'flute', 'oboe', 'clarinet', 'bassoon',
  'french_horn', 'trumpet', 'trombone', 'tuba',
  'orchestral_harp', 'marimba', 'timpani',
  'violin', 'violin', 'viola', 'cello', 'contrabass',
];
//var led_states = Array.apply(null, {length: 16}).map(() => 'led-gray');
var led_states = {
};
for(let i=0; i< 16; i++) {
  led_states[i] = 'led-gray'
}

const soundfonts = State('soundfonts',{
  initial: {
    ready: false,
    instruments: [],
    instrumentLedStates: led_states,
    instrumentNames: filenames,
    translator: new MIDI2SFTranslator()
  },

  setKeyValue: (state, payload) => ({
    [payload.key]: payload.value
  }),

  setInstrumentState: (state, payload) => ({
    instrumentLedStates: {...state.instrumentLedStates, [payload.key]: payload.value }
  })
});

export default soundfonts;

export function loadSoundFonts() {
  let ac = new AudioContext();
  let {instrumentNames} = soundfonts.getState();
  for (let index = 0; index < 16; index++) {
    soundfonts.setInstrumentState({key: index, value: 'led-blue'});
    loadInstrument(index, instrumentNames[index], ac);
  }
}

function loadInstrument(channel, instrument_name, audio_context) {
  Soundfont.instrument(audio_context, instrument_name, {from: 'http://gleitz.github.io/midi-js-soundfonts/MusyngKite/', release: 2, loop: true}).then(
    function (instr) {
      let {translator} = soundfonts.getState();
      instr.listenToMidi(translator[channel], {channel: channel});
      soundfonts.setInstrumentState({key: channel, value: 'led-green'});

    }
  )
}

