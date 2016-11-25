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
import {SoundFontSynthesizer} from '../pojos/sfplayer/sound_font_synth'
//import '../pojos/audiocontextmonkeypatch'

var selected_midi_output;

const MIDI_STATUS_NOTE_OFF = 8;
const MIDI_STATUS_NOTE_ON = 9;
const PRESETNUMBERS = [
  74,
  69,
  72,
  71,
  61,
  57,
  58,
  59,
  47,
  2,
  0,
  41,
  41,
  42,
  43,
  44
];

class MIDI2SFTranslator {
  constructor() {
    for(let channel=0; channel < 16; channel++) {
      this[channel] = {}
    }
    this.noteOnHandler = undefined;
    this.noteOffHandler = undefined;
  }

  setNoteOnOffHandlers(noteOnHandler, noteOffHandler, instance) {
    this.noteOnHandler = noteOnHandler.bind(instance);
    this.noteOffHandler = noteOffHandler.bind(instance);
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
    let status = paramList[0] >> 4;

    if (this.noteOnHandler && this.noteOffHandler && paramList.length > 1) {
      console.log(paramList);


      if (status === MIDI_STATUS_NOTE_OFF) {
        this.noteOffHandler(paramList)
      }
      else {

        if (status === MIDI_STATUS_NOTE_ON) {
                this.noteOnHandler(paramList);
              }
              else {
                console.log('unknown status', status);
              }
      }
    }
  }
}

const soundfonts = State('soundfonts',{
  initial: {
    ready: false,
    synth: '',
    translator: new MIDI2SFTranslator(),
    loadingText: 'Loading...'
  },

  setKeyValue: (state, payload) => ({
    [payload.key]: payload.value
  }),

  setLoadingPercentage: (state, payload) => ({
    loadingPercentage: payload
  })
});

export default soundfonts;

export function loadSoundFontsOld() {
  let {instrumentNames} = soundfonts.getState();
  let {ios, ogg} = features.getState();
  if (ios || !ogg ) {
    let channels = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
    loadInstrument(channels, instrumentNames[9], 100, {format: 'mp3'});
  }
  /*
  else if ( window.location.hostname === 'localhost' ) {
    loadInstrument([0,1,2,3], instrumentNames[1], 25,'ogg');
    loadInstrument([4,5,6,7], instrumentNames[6], 25,'ogg');
    loadInstrument([8,9,10], instrumentNames[8], 25,'ogg');
    loadInstrument([11,12,13,14,15], instrumentNames[13], 25,'ogg')
  }

  else {
    for (let index = 0; index < 16; index++) {
      let fraction = 100.0 / 16.0;
      loadInstrument([index], instrumentNames[index], fraction, 'mp3');
    }
  }
   */
  else {
    for(let instrument of sectionFilenames) {
      let fraction = 25;
      loadInstrument(instrument.channels, instrument.name, fraction, instrument.options)
    }
  }
}

export function loadSoundFonts() {
  var xhr = new XMLHttpRequest();
  let url = '/classical-instruments-voices.sf2';
  //url = 'http://www.filedropper.com/classical-instruments-voices';
  xhr.open('GET', url);
  xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
  xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  xhr.setRequestHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token');
  xhr.responseType = 'arraybuffer';
  xhr.addEventListener('load', onSoundFontLoaded);
  xhr.addEventListener('progress', onUpdateLoadingProgress);
  xhr.send();
}

function onUpdateLoadingProgress (oEvent) {
  if (oEvent.lengthComputable) {
    soundfonts.setLoadingPercentage(parseInt((oEvent.loaded / oEvent.total)*100));
    // ...
  } else {
    soundfonts.setLoadingPercentage("unknown");
    // Unable to compute progress information since the total size is unknown
  }
}

function onSoundFontLoaded(event) {
  let {translator} = soundfonts.getState();
  let data = event.target.response;
  let synth = new SoundFontSynthesizer(new Uint8Array(data));

  synth.init();
  synth.start();

  synth.channelInstrument = PRESETNUMBERS;
  console.log(synth);
  soundfonts.setKeyValue({synth});
  soundfonts.setKeyValue({key: "ready", value: true});
  soundfonts.setKeyValue({key: 'loadingText', value: 'done'});
  translator.noteOnHandler = synth.noteOn.bind(synth);
  translator.noteOffHandler = synth.noteOff.bind(synth);

}


function loadInstrument(channels, instrument_name, percentage, options) {
  let aud_cxt = audio_context;

  Soundfont.instrument(
    aud_cxt,
    instrument_name,
    {from: 'http://gleitz.github.io/midi-js-soundfonts/MusyngKite/' ,release: 3, ...options}
  ).then(
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
      //soundfonts.addLoadingPercentage(percentage);
      let {loadingPercentage} = soundfonts.getState();
      if (loadingPercentage === 100) {
        soundfonts.setKeyValue({key: "ready", value: true})
      }
    }
  )
}

