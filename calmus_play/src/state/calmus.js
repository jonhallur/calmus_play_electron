/**
 * Created by jonh on 18.9.2016.
 */
import {State} from 'jumpsuit'
import axios from 'axios'
//const ipc = require('electron').ipcRenderer;

console.log(process);
/*
var exampleSocket = new WebSocket("ws://89.160.214.32:9001");

exampleSocket.onopen = function (event) {
  console.log("socket is open");
};

exampleSocket.onmessage = function (event) {
  console.log(event.data);
}

*/
/*
class Client extends TCPBase {
  getHeader() {
    return this.read(8)
  }

  getBodyLength() {
    return header.readInt32BE(4)
  }

  decode(body, header) {
    return {
      id: header.readInt32BE(0),
      data: body,
    };
  }

  // heartbeat packet
  get heartBeatPacket() {
    return new Buffer([ 255, 255, 255, 255, 0, 0, 0, 0 ]);
  }
}
*/
const calmusState = State('calmus', {
  initial: {
    attackList: [],
    channelsList: [],
    pitchList: [],
    durationList: [],
    velocityList: [],
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
    calmusConnection: true
  }),
  setWaitingForCalmus: (state, payload) => ({
    waitingForCalmus: payload
  })
});

export default calmusState

function onConnectedCallback(args) {
  calmusState.setCalmusConnection(true)
}

function onSentCallback(args) {
  calmusState.setWaitingForCalmus(true)
}

export function sendCalmusRequest(requestString) {
  console.log("send to calmus =>",requestString);
  //var exampleSocket = new WebSocket("ws://89.160.214.32:9001");
  //exampleSocket.send("0 0 1 2 3 4 5")
  var xhr = new XMLHttpRequest();
  var server = 'http://89.160.214.32:9001/';

  xhr.open('POST', server + requestString, true);
  xhr.send(requestString.replace(/\//g, ' '));

}

function str2ab(str) {
  var buf = new ArrayBuffer(str.length*2);
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
  console.log("handle calmus data not defined")
}

window.calmusstate = calmusState;