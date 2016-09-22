/**
 * Created by jonh on 22.9.2016.
 */
import {State} from 'jumpsuit'
import WebMidi from 'webmidi';


const MS_PER_MINUTE = 60000;
const DEFAULT_TEMPO = 120;
const TICKS_PER_BEAT = 96;

const midiState = State('midi', {
  initial: {
    available: false,
    ready: false,
    connected: false,
    in_name: '',
    out_name: '',
    in_id: '',
    out_id: '',
    ins: [],
    outs: [],
    input_set: false,
    output_set: false,
    tempo: DEFAULT_TEMPO,
    tick_length: (MS_PER_MINUTE / DEFAULT_TEMPO) / TICKS_PER_BEAT
  },

  setAvailable: (state, payload) => ({
    available: payload
  }),
  setReady: (state, payload) => ({
    ready: payload
  }),
  setAvailableIns: (state, payload) => ({
    ins: payload
  }),
  setAvailableOuts: (state, payload) => ({
    outs: payload
  }),
  setTickLength: (state, payload) => ({
    tick_length: payload
  }),
  setInId: (state, payload) => ({
    in_id: payload,
    input_set: true
  }),
  setOutId: (state, payload) => ({
    out_id: payload,
    output_set: true
  })
});

export default midiState;

export function getMidiPorts() {
  WebMidi.enable(function (err) {

    if (err) {
      console.log("WebMidi could not be enabled.", err);
    } else {
      midiState.setAvailableIns(WebMidi.inputs);
      midiState.setAvailableOuts(WebMidi.outputs);
      midiState.setAvailable(true);
      midiState.setInId('');
    }

  });
  //console.log("Port Names =>", portNames)
}

export function setTempo(tempo) {
  let msPerBeat = MS_PER_MINUTE / tempo;
  let tickLength = msPerBeat / TICKS_PER_BEAT;
  midiState.setTickLength(tickLength);
}

export function setMidiInput(id) {
  midiState.setInId(id);
}
export function setMidiOutput(id) {
  midiState.setOutId(id)
}

export function playComposition(midiEventList, out_id, tempo) {
  if (midiEventList.length === 0 ) {
    console.log("nothing to play")
  }
  else if(out_id === '') {
    console.log("no output selected")
  }
  else {

    console.log(midiEventList);
    let output = WebMidi.getOutputById(out_id);
    let tempo = tempo || 120;
    let tick_length = (MS_PER_MINUTE / tempo) / TICKS_PER_BEAT;
    for (let event of midiEventList) {
      output.playNote(
        event.pitch,
        event.channel,
        {
          velocity: event.velocity/127,
          duration: event.duration * tick_length,
          time: WebMidi.time + event.attack * tick_length
        }
      );
    }
  }
}