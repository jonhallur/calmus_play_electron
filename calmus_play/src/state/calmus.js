/**
 * Created by jonh on 18.9.2016.
 */
import {State} from 'jumpsuit'
import {NotificationManager} from 'react-notifications';
import {createMidiFile} from './player'


class MidiEvent {
  constructor(attack, channel, pitch, duration, velocity) {
    this.attack = attack;
    this.channel = channel;
    this.pitch = pitch;
    this.duration = duration;
    this.velocity = velocity;
  }
}

const calmusState = State('calmus', {
  initial: {
    attackList: [],
    channelsList: [],
    pitchList: [],
    durationList: [],
    velocityList: [],
    midiEventList: [],
    compositionReady: false,
    payloadsReceived: 0,
    calmusConnection: false,
    waitingForCalmus: false,
    requestString: ''
  },

  setAttackList: (state, payload) => ({
    attackList: payload
  }),
  setChannelList: (state, payload) => ({
    channelsList: payload
  }),
  setPitchList: (state, payload) => ({
    pitchList: payload
  }),
  setDurationList: (state, payload) => ({
    durationList: payload
  }),
  setVelocityList: (state, payload) => ({
    velocityList: payload
  }),
  setCalmusConnection: (state, payload) => ({
    calmusConnection: payload
  }),
  setWaitingForCalmus: (state, payload) => ({
    waitingForCalmus: payload
  }),
  setMidiEventList: (state, payload) => ({
    midiEventList: payload
  }),
  setCompositionReady: (state, payload) => ({
    compositionReady: payload
  }),
  setRequestString: (state, payload) => ({
    requestString: payload
  })
});

export default calmusState

export function sendCalmusRequest(requestString, out_id) {
  NotificationManager.info("Connecting...", "Calmus", 2000);
  var exampleSocket = new WebSocket("ws://89.160.139.113:9001");
  calmusState.setWaitingForCalmus(true);
  calmusState.setCompositionReady(false);

  exampleSocket.onopen = function (stuff) {
    exampleSocket.send(requestString);
    NotificationManager.info("Composing...", "Calmus", 2000);
    calmusState.setCalmusConnection(true)
  };

  exampleSocket.onmessage = function (message) {
    handleCalmusData(message.data, requestString);
    NotificationManager.info("Composition Ready", "Calmus", 2000);
    calmusState.setRequestString(requestString);
    calmusState.setCalmusConnection(false);
    calmusState.setWaitingForCalmus(false);
  };

  exampleSocket.onerror = function (error) {
    NotificationManager.error('Connection to server failed', 'Calmus ERROR', 5000);
  };

  /*
  var xhr = new XMLHttpRequest();
  xhr.addEventListener("load", eventListener);
  var server = 'http://89.160.139.113:9001/';
  xhr.open('GET', server + requestString, true);
  //xhr.setRequestHeader("Content-Type", "text/plain");
  xhr.withCredentials = false;
  xhr.send();
  */
}

function str2ab(str) {
  var buf = new ArrayBuffer(str.length);
  var bufView = new Uint8Array(buf);
  for (var i=0, strLen=str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}

function createEventList(attackList, channelList, pitchList, durationList, velocityList) {
  var midiEventList = [];
  for (var i = 0; i < attackList.length; i++) {
    midiEventList.push(
      new MidiEvent(
        attackList[i],
        channelList[i],
        pitchList[i],
        durationList[i],
        velocityList[i]
      )
    )
  }
  return midiEventList;
}
function handleCalmusData(calmusData, requestString) {
  let lists = calmusData.split('(');
  let attackList = lists[2].split(')')[0].split(' ');
  let channelList = lists[3].split(')')[0].split(' ');
  let pitchList = lists[4].split(')')[0].split(' ');
  let durationList = lists[5].split(')')[0].split(' ');
  let velocityList = lists[6].split(')')[0].split(' ');
  let adjective = lists[6].split(')')[1];

  let midiEventList = createEventList(attackList, channelList, pitchList, durationList, velocityList);

  calmusState.setAttackList(attackList);
  calmusState.setChannelList(channelList);
  calmusState.setPitchList(pitchList);
  calmusState.setDurationList(durationList);
  calmusState.setVelocityList(velocityList);
  calmusState.setMidiEventList(midiEventList);
  calmusState.setCompositionReady(true);
  createMidiFile(midiEventList, adjective + " " + requestString)
}

window.calmusstate = calmusState;