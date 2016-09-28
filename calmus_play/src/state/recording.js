/**
 * Created by jonh on 26.9.2016.
 */
import {State} from 'jumpsuit'
import WebMidi from 'webmidi'
import MidiEvent from '../pojos/midievent'
import * as clickTrack from '../pojos/metronome'


var metronomecounter = 0;
var recordingtime = 0;
const upBeat = new Audio("pt_click1.wav");
const downBeat = new Audio("pt_click2.wav");

const recording = State('recording', {
  initial: {
    isRecording: false,
    metronome: true,
    intervalId: 0,
    intervalTime: 500,
    sounds: [upBeat, downBeat, downBeat, downBeat],
    tempo: 120,
    inputHandle: '',
    noteOns: [],
    noteOffs: [],
    ready: false,
    eventList: []
  },

  setIsRecording: (state, payload) => ({
    isRecording: payload
  }),

  setMetronome: (state, payload) => ({
    metronome: payload
  }),

  setIntervalId: (state, payload) => ({
    intervalId: payload
  }),

  setTempo: (state, payload) => ({
    tempo: payload,
    intervalId: 60 / payload
  }),

  setInputHandle: (state, payload) => ({
    inputHandle: payload
  }),

  addNoteOn: (state, payload) => ({
    noteOns: [...state.noteOns, payload]
  }),

  addNoteOff: (state, payload) => ({
    noteOffs: [...state.noteOffs, payload]
  }),

  setReady: (state, payload) => ({
    ready: payload
  }),

  setEventList: (state, payload) => ({
    eventList: payload
  }),

  clearRecording: (state, payload) => ({
    noteOns: [],
    noteOffs: []
  })
});

export default recording

export function startRecording(intervalTime, metronome, sounds, in_id) {
  recordingtime = WebMidi.time;
  clickTrack.play();
  /*
  metronomecounter = 0;
  let intervalId = setInterval(function() {
    if(metronome) {
      sounds[metronomecounter%4].play();
      metronomecounter++;
    }
  }, intervalTime);
  sounds[metronomecounter%4].play();
  metronomecounter++;
  */
  let input = WebMidi.getInputById(in_id);
  input.addListener(
    'noteon',
    'all',
    function(e) {
      console.log("noteon", e.note, WebMidi.time - recordingtime);
      recording.addNoteOn({note: e.note.number, time: (WebMidi.time - recordingtime), velocity: e.velocity})
    });
  input.addListener(
    'noteoff',
    'all',
    function(e) {
      console.log("noteoff", e.note, WebMidi.time - recordingtime);
      recording.addNoteOff({note: e.note.number, time: (WebMidi.time - recordingtime)})
    }
  );
  //recording.setIntervalId(intervalId);
  recording.setInputHandle(input);
  recording.setIsRecording(true);
  recording.setReady(false);

}

export function stopRecording(intervalId, inputHandle, noteOns, noteOffs, tickLength) {
  clickTrack.play();
  let recEndTime = WebMidi.time - recordingtime;
  //clearInterval(intervalId);
  inputHandle.removeListener('noteon');
  inputHandle.removeListener('noteoff');
  recording.setIsRecording(false);
  recording.setInputHandle('');
  //recording.setIntervalId(0);
  recording.setEventList([]);
  metronomecounter = 0;
  if(noteOns.length === 0) {
    recording.clearRecording();
    return;
  }
  let eventList = [];
  for(let noteon of noteOns) {
    let noteNumber = noteon.note;
    let duration = 0;
    for(let i=0; i<noteOffs.length; i++) {
      let noteoff = noteOffs[i];
      if(noteNumber === noteoff.note) {
        duration = noteoff.time - noteon.time;
        eventList.push(
          new MidiEvent(
            Math.round(noteon.time/tickLength),
            1,
            noteon.note,
            Math.round(duration/tickLength),
            Math.round(noteon.velocity*127)
          )
        );
        noteOffs.splice(i, 1);
        break;
      }
    }
    if (duration === 0) {
      console.log(noteon.time);
      console.log(recEndTime);
      duration = recEndTime - noteon.time;
      eventList.push(
        new MidiEvent(
          Math.round(noteon.time/tickLength),
          1,
          noteon.note,
          Math.round(duration/tickLength),
          Math.round(noteon.velocity*127)
        )
      );
    }

  }
  if (eventList.length > 0) {
    console.log(eventList);
    recording.setEventList(eventList);
    recording.setReady(true);
  }
  recording.clearRecording();
}