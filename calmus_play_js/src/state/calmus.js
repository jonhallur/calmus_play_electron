/**
 * Created by jonh on 18.9.2016.
 */
import {State} from 'jumpsuit'
import {NotificationManager} from 'react-notifications';
import {createMidiFile} from './player'
import MidiEvent from '../pojos/midievent'
import uistate from './ui'
import midi from './midi'
import recording from './recording'
import inputcell from './inputcell'

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

function getPartsList() {
  let {
    addWood,
    addBrass,
    addStrings,
    addPercussion,
  } = uistate.getState();
  return [addWood, addBrass, addStrings, addPercussion];
}

function createOrchestrationString(shouldRecompose) {
  let {
    addWood,
    addBrass,
    addStrings,
    addPercussion,
    rhythmComplexity,
    melodyStrong,
    harmonyStrong,
  } = uistate.getState();
  return [
    addWood ? 't': 'nil',
    addBrass ? 't': 'nil',
    addStrings ? 't': 'nil',
    addPercussion ? 't': 'nil',
    rhythmComplexity,
    harmonyStrong ? 't': 'nil',
    melodyStrong ? 't': 'nil',
    shouldRecompose ? 't': 'nil'
  ].join(' ');
}

function getCompositionSettingsList() {
  let {
    transposeValue,
    speedValue,
    sizeValue,
    colorValue,
    intervalValue,
    polyphonyValue,
    scaleValue,
  } = uistate.getState();
  return [
    transposeValue,
    speedValue,
    sizeValue,
    colorValue,
    intervalValue,
    polyphonyValue,
    scaleValue,
  ];
}

export function missingSettings() {
  var inputValues = getCompositionSettingsList();
  let has_empty_strings = inputValues.map(x => x === '');
  if (has_empty_strings.reduce((a, b) => (a || b))) {
    NotificationManager.warning("You have to set all settings before composing", "Settings", 5000);
    return true;
  }
  if (!getPartsList().reduce((a,b) => (a || b))) {
    NotificationManager.warning("You have to select a part to compose for", "Settings", 5000);
    return true;
  }
  return false;
}

export function sendCalmusRequest(useInput, shouldRecompose) {
  if (missingSettings()) {
    return;
  }
  let {eventList} = inputcell.getState();
  if (eventList.length === 0 && useInput) {
    NotificationManager.warning("Nothing was recorded", "Recorder", 5000);
    return;
  }
  var inputValues = getCompositionSettingsList();
  let requestString = inputValues.join(' ');
  let orchestrationString = createOrchestrationString(shouldRecompose);
  let {out_id} = midi.getState();
  var url = "ws://89.160.139.113:9010";
  if (window.location.protocol === 'https:')
  {
    url = "wss://89.160.139.113:9010";
  }
  var exampleSocket = new WebSocket(url);
  calmusState.setWaitingForCalmus(true);
  calmusState.setCompositionReady(false);

  exampleSocket.onopen = function (stuff) {
    if (!useInput) {
      var data = requestString + " nil nil nil nil " + orchestrationString;
      exampleSocket.send(data);
      console.log(data);
      uistate.debugPrint(data);
      NotificationManager.info("Composing...", "Calmus", 3000);
    }
    else if(eventList !== undefined) {
      let new_cell = createListsFromEventList(eventList);
      exampleSocket.send(requestString + new_cell + orchestrationString);
      console.log(requestString, orchestrationString);
      uistate.debugPrint(requestString + orchestrationString);

      NotificationManager.info("Composing with Input...", "Calmus", 3000);

    }
    calmusState.setCalmusConnection(true)
  };

  exampleSocket.onmessage = function (message) {
    if (message.data[0] === '(') {
      handleCalmusData(message.data);
      NotificationManager.info("Composition Ready", "Calmus", 3000);
      calmusState.setRequestString(requestString);
      calmusState.setCalmusConnection(false);
      calmusState.setWaitingForCalmus(false);
    }
    else {
      NotificationManager.success(message.data, "Calmus Says", 3000);
    }

  };

  exampleSocket.onerror = function (error) {
    NotificationManager.error('Connection to server failed', 'Calmus ERROR', 5000);
    calmusState.setCalmusConnection(false);
    calmusState.setWaitingForCalmus(false);
  };

  exampleSocket.onclose = function (args) {
    NotificationManager.info('Connection closed', 'Calmus', 3000);
    calmusState.setCalmusConnection(false);
    calmusState.setWaitingForCalmus(false);
  }
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
function handleCalmusData(calmusData) {
  let lists = calmusData.split('(');
  let attackList = lists[2].split(')')[0].split(' ');
  let channelList = lists[3].split(')')[0].split(' ');
  let pitchList = lists[4].split(')')[0].split(' ');
  let durationList = lists[5].split(')')[0].split(' ');
  let velocityList = lists[6].split(')')[0].split(' ');
  let settingsList = lists[7].split(')')[0].split(' ');
  let compositionText = lists[8].split(')')[0];
  let saveFileStartingPoint = 0;
  for(let i = 0; i < 9; i++) {
    saveFileStartingPoint += lists[i].length;
  }
  saveFileStartingPoint += 9;
  let cell = calmusData.slice(saveFileStartingPoint, calmusData.length - 1);
  cell = cell.replace(/CCL::/g, "");
  let num_mel = settingsList[0];
  let interval = settingsList[1];
  let scale = settingsList[2];
  let color = settingsList[3];
  uistate.setSize(num_mel);
  uistate.setInteval(interval);
  uistate.setScale(scale);
  uistate.setColor(color);
  let adjective = compositionText.split(' - ')[0];
  let description = compositionText.split(' - ')[1];
  let midiEventList = createEventList(attackList, channelList, pitchList, durationList, velocityList);

  calmusState.setAttackList(attackList);
  calmusState.setChannelList(channelList);
  calmusState.setPitchList(pitchList);
  calmusState.setDurationList(durationList);
  calmusState.setVelocityList(velocityList);
  calmusState.setMidiEventList(midiEventList);
  calmusState.setCompositionReady(true);
  createMidiFile(midiEventList, {adjective, description}, cell)
}

window.calmusstate = calmusState;