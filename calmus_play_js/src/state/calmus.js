/**
 * Created by jonh on 18.9.2016.
 */
import {State} from 'jumpsuit'
import {NotificationManager} from 'react-notifications';
import {createMidiFile} from './player'
import MidiEvent from '../pojos/midievent'
import ui_state from './ui'

var SERVER = '';

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

  setKeyValue: (state, payload) => ({
    [payload.key]: payload.value
  }),

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

export function createListsFromEventList(eventList) {
  let attack = [];
  let pitch = [];
  let duration = [];
  let velocity = [];
  let lastTime = 0;
  for (let midievent of eventList) {
    attack.push(midievent.attack - lastTime);
    pitch.push(midievent.pitch);
    duration.push(midievent.duration);
    velocity.push(midievent.velocity);
    lastTime = midievent.attack;
  }
  attack.splice(0,1);
  attack.push(duration[duration.length-1]);
  attack[attack.length-1] = duration[duration.length-1];
  let attackString = '(' + attack.join(' ') + ')';
  let pitchString = '(' + pitch.join(' ') + ')';
  let durationString = '(' + duration.join(' ') + ')';
  let velocityString = '(' + velocity.join(' ') + ')';
  return attackString+pitchString+durationString+velocityString
}

export function sendCalmusRequest(requestString, orchestrationString, out_id, eventList) {
  NotificationManager.info("Connecting...", "Calmus", 2000);
  var url = "ws://89.160.139.113:9001";
  if (window.location.protocol === 'https:')
  {
    url = "wss://89.160.139.113:9001";
  }
  var exampleSocket = new WebSocket(url);
  calmusState.setWaitingForCalmus(true);
  calmusState.setCompositionReady(false);

  exampleSocket.onopen = function (stuff) {
    if (eventList === undefined) {
      exampleSocket.send(requestString + " nil nil nil nil" + orchestrationString);
      NotificationManager.info("Composing...", "Calmus", 2000);
    }
    else {
      let new_cell = createListsFromEventList(eventList);
      exampleSocket.send(requestString + new_cell + orchestrationString);
      NotificationManager.info("Composing wi  th Input...", "Calmus", 2000);

    }
    calmusState.setCalmusConnection(true)
  };

  exampleSocket.onmessage = function (message) {
    console.log(message.data);
    handleCalmusData(message.data, requestString, out_id);
    NotificationManager.info("Composition Ready", "Calmus", 2000);
    console.log(message.data);
    calmusState.setRequestString(requestString);
    calmusState.setCalmusConnection(false);
    calmusState.setWaitingForCalmus(false);
  };

  exampleSocket.onerror = function (error) {
    NotificationManager.error('Connection to server failed', 'Calmus ERROR', 5000);
  };

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
function handleCalmusData(calmusData, requestString, out_id) {
  let lists = calmusData.split('(');
  let attackList = lists[2].split(')')[0].split(' ');
  let channelList = lists[3].split(')')[0].split(' ');
  let pitchList = lists[4].split(')')[0].split(' ');
  let durationList = lists[5].split(')')[0].split(' ');
  let velocityList = lists[6].split(')')[0].split(' ');
  //let adjective = lists[6].split(')')[1];
  let settingsList = lists[7].split(')')[0].split(' ');
  let num_mel = settingsList[0];
  let interval = settingsList[1];
  let scale = settingsList[2];
  ui_state.setSize(num_mel);
  ui_state.setInteval(interval);
  ui_state.setScale(scale);
  let compositionText = lists[8].split(')')[0];
  let midiEventList = createEventList(attackList, channelList, pitchList, durationList, velocityList);

  calmusState.setAttackList(attackList);
  calmusState.setChannelList(channelList);
  calmusState.setPitchList(pitchList);
  calmusState.setDurationList(durationList);
  calmusState.setVelocityList(velocityList);
  calmusState.setMidiEventList(midiEventList);
  calmusState.setCompositionReady(true);
  createMidiFile(midiEventList, compositionText, out_id)
}

window.calmusstate = calmusState;