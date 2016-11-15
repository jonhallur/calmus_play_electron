/**
 * Created by jonh on 28.10.2016.
 */
import {State} from 'jumpsuit'
import Soundfont from 'soundfont-player'
import midistate from './midi'
import WebMidi from 'webmidi'
import audio_context from 'audio-context'
import features from './features'
import uistate from './ui'
//import '../pojos/audiocontextmonkeypatch'

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
      console.log(msg);
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
  'orchestral_harp', 'acoustic_grand_piano', 'timpani',
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
    translator: new MIDI2SFTranslator(),
    loadingPercentage: 0.0,
    loadingText: 'Loading...'
  },

  setKeyValue: (state, payload) => ({
    [payload.key]: payload.value
  }),

  setInstrumentState: (state, payload) => ({
    instrumentLedStates: {...state.instrumentLedStates, [payload.key]: payload.value }
  }),

  addLoadingPercentage: (state, payload) => ({
    loadingPercentage: state.loadingPercentage + payload
  })
});

export function loadSoundFonts() {
  //let ac = new AudioContext();
  let ac = audio_context;
  let {instrumentNames} = soundfonts.getState();
  let {ios, ogg} = features.getState();
  if (ios || window.location.hostname === 'localhost' || !ogg ) {
    let channels = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
    loadInstrument(channels, instrumentNames[9], ac, 100, 'mp3');
  }
  else {
    for (let index = 0; index < 16; index++) {
      let fraction = 100.0 / 16.0;
      loadInstrument([index], instrumentNames[index], ac, fraction, 'ogg');
    }
  }
}

export default soundfonts;

function loadInstrument(channels, instrument_name, aud_cxt, percentage, format) {
  Soundfont.instrument(aud_cxt, instrument_name, {from: 'http://gleitz.github.io/midi-js-soundfonts/MusyngKite/', release: 3, format: format}).then(
    function (instr) {
      let {translator} = soundfonts.getState();
      for(let channel of channels) {
        instr.listenToMidi(translator[channel], {channel: channel});
        uistate.debugPrint("connected " + channel + " to " + instrument_name)
      }
      let loadingString = instrument_name.charAt(0).toUpperCase() + instrument_name.substr(1);
      loadingString = loadingString.replace(/_/g, ' ');
      loadingString = loadingString + " done";
      soundfonts.setKeyValue({key: 'loadingText', value: loadingString});
      soundfonts.addLoadingPercentage(percentage);
      let {loadingPercentage} = soundfonts.getState();
      if (loadingPercentage === 100) {
        soundfonts.setKeyValue({key: "ready", value: true})
      }
    }
  )
}

