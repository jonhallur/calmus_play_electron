/**
 * Created by jonh on 13.11.2016.
 */
import {State} from 'jumpsuit'
import _ from 'lodash'
import midinote from 'midi-note'

const inputcell = State('inputcell',{
  initial: {
    eventList: [],
    ready: false,
    name: '',
    inputOpen: false,
  },

  setKeyValue: (state, payload) => ({
    [payload.key]: payload.value
  }),

  doneSaving: (state, payload) => ({
    name: '',
    inputOpen: false,
  })
});

export default inputcell

function getEventsInfo(eventList) {
  let lastEndTime = 0;
  let maxNote = 0;
  let minNote = 127;
  for(let i=0; i < eventList.length; i++) {
    let event = eventList[i];
    let eventEndTime = event.attack + event.duration;
    if (eventEndTime > lastEndTime) {
      lastEndTime = eventEndTime
    }
    if (event.pitch > maxNote) {
      maxNote = event.pitch;
    }
    if (event.pitch < minNote) {
      minNote = event.pitch;
    }
  }
  return {max: maxNote, min: minNote, endTime: lastEndTime};
}

export function setInputCell(eventList) {
  inputcell.setKeyValue({key: 'eventList', value: eventList});
  inputcell.setKeyValue({key: 'ready', value: true});
  drawInputCell();
}

export function drawInputCell() {
  let {eventList} = inputcell.getState();
  if(eventList.length === 0) {
    return;
  }
  let canvas = document.getElementById('inputcell');
  let ctx = canvas.getContext('2d');
  let startTime = _.first(eventList).attack;
  let eventsInfo = getEventsInfo(eventList);
  let endTime = eventsInfo.endTime;
  let relativeRangeX = endTime - startTime;
  let relativeRangeY = eventsInfo.max - eventsInfo.min;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  let lowNote = midinote(eventsInfo.min);
  let highNote = midinote(eventsInfo.max);
  ctx.font = "bold 14px sans-serif";
  ctx.beginPath();
  ctx.fillStyle = 'red';
  ctx.fillText(lowNote, 0, 100);
  ctx.fillText(highNote, 0, 14);
  for(let i = 0; i < eventList.length; i ++) {
    let event = eventList[i];
    let eventRelativeStart = (event.attack - startTime) / relativeRangeX;
    let eventRelativeEnd = (event.attack + event.duration - startTime) / relativeRangeX;
    let eventRelativePitch = (event.pitch - eventsInfo.min) / relativeRangeY;

    var fromX = eventRelativeStart*canvas.width;
    var toX = eventRelativeEnd*canvas.width;
    var y = canvas.height - (eventRelativePitch * canvas.height);
    ctx.beginPath();
    ctx.moveTo(fromX, y);
    ctx.lineTo(toX, y);
    ctx.stroke();
  }

}