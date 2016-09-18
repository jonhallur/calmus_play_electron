/**
 * Created by jonh on 18.9.2016.
 */
import {State} from 'jumpsuit'
//const ipc = require('electron').ipcRenderer;

console.log(process);

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
    channelList: [],
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
    channelList: payload
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
  console.log("send to calmus =>",requestString)
  /*
  var body = str2ab(requestString);
  const client = new Client({
    host: '89.160.214.32',
    port: 9001,
  });
  const data = new Buffer(8 + body.length);
  data.writeInt32BE(1, 0);
  data.writeInt32BE(body.length, 4);
  body.copy(data, 8, 0);

  client.send({
    id: 1,
    data,
    timeout: 5000,
  }, (err, res) => {
    if (err) {
      console.error(err);
    }
    console.log("message =>",res.toString()); // should echo 'hello'
  });
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
  console.log("handle calmus data not defined")
}
