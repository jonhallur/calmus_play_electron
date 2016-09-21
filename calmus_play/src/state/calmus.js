/**
 * Created by jonh on 18.9.2016.
 */
import {State} from 'jumpsuit'

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
  })
});

export default calmusState

export function sendCalmusRequest(requestString) {
  console.log("send to calmus =>",requestString);
  var exampleSocket = new WebSocket("ws://89.160.139.113:9001");
  calmusState.setWaitingForCalmus(true);


  exampleSocket.onopen = function (stuff) {
    exampleSocket.send(requestString);
    calmusState.setCalmusConnection(true)
  };

  exampleSocket.onmessage = function (message) {
    handleCalmusData(message.data);
    calmusState.setCalmusConnection(false);
    calmusState.setWaitingForCalmus(false);
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

function handleCalmusData(calmusData) {
  let lists = calmusData.split('(');
  console.log(lists);
  var midiEventList = [];
  var attackList = lists[2].split(')')[0];
  var channelList = lists[3].split(')')[0];
  var pitchList = lists[4].split(')')[0];
  var durationList = lists[5].split(')')[0];
  var velocityList = lists[6].split(')')[0];
  for(var i=0; i<attackList.length;i++) {
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
  calmusState.setAttackList(attackList);
  calmusState.setChannelList(channelList);
  calmusState.setPitchList(pitchList);
  calmusState.setDurationList(durationList);
  calmusState.setVelocityList(velocityList);
}

window.calmusstate = calmusState;