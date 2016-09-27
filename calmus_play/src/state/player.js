/**
 * Created by jonh on 22.9.2016.
 */
import {State} from 'jumpsuit'
import {File} from 'midijs'
import MIDIPlayer from 'midiplayer'
import MIDIFile from 'midifile'
import WebMidi from 'webmidi'
import {NotificationManager} from 'react-notifications'


const MS_PER_MINUTE = 60;
const DEFAULT_TEMPO = 120;
const TICKS_PER_BEAT = 96;

const player = State('player', {
  initial: {
    files:[],
    ready: false,
    playing: false,
    players: [],
    interval: 0,
    current_length: 0,
    current_position: 0
  },

  addFile: (state, payload) => ({
    files: [payload, ...state.files]
  }),

  removeFile (state, payload) {
    state.files.remove(payload);
    return { files: state.files };
  },

  setCurrentLenght: (state, payload) => ({
    current_length: payload,
    current_position: payload
  }),

  tickCurrentPosition: (state, payload) => ({
    current_position: --state.current_position
  }),

  addPlayer: (state, payload) => ({
    players: [payload, ...state.players]
  }),

  setInterval: (state,payload) => ({
    interval: payload
  }),



});

export default player

function addNoteOnNoteOff(file, track_num, event, last_abs_time) {
  let delta_note_one = Number(event.attack) - last_abs_time[track_num];
  file.getTrack(track_num).addEvent(
    new File.ChannelEvent(
      File.ChannelEvent.TYPE.NOTE_ON, {
        note: Number(event.pitch),
        velocity: Number(event.velocity)
      },
      Number(event.channel),
      delta_note_one
    )
  );
  file.getTrack(track_num).addEvent(
    new File.ChannelEvent(
      File.ChannelEvent.TYPE.NOTE_OFF, {
        note: Number(event.pitch),
        velocity: Number(event.velocity)
      },
      Number(event.channel),
      Number(event.duration)
    )
  );
  last_abs_time[track_num] = Number(event.attack) + Number(event.duration)
}

function addTrack(file, event) {
  file.addTrack(
    new File.MetaEvent(File.MetaEvent.TYPE.SEQUENCE_NAME, {
      text: "Channel " + event.channel
    }))
}

function insertEndTrackEvent(midi_channels, file) {
  for (let channel of midi_channels) {
    let channel_num = midi_channels.indexOf(channel);
    file.getTrack(channel_num).addEvent(
      new File.MetaEvent(File.MetaEvent.TYPE.END_OF_TRACK)
    )
  }
}

function createFileHeader() {
  var file = new File();
  file.getHeader().setTicksPerBeat(96);
  file.getHeader().setFileType(File.Header.FILE_TYPE.SYNC_TRACKS);
  return file;
}

export function createMidiFile(midiEvents, settings, out_id){
  var file = createFileHeader();
  let midi_channels = [];
  let last_event_time = [0,0,0];
  for(let event of midiEvents) {
    let track_number = midi_channels.indexOf(event.channel);
    if(track_number === -1) {
      midi_channels.push(event.channel);
      addTrack(file, event);
      track_number = midi_channels.indexOf(event.channel)
    }
    addNoteOnNoteOff(file, track_number, event, last_event_time);
  }
  insertEndTrackEvent(midi_channels, file);
  let binaryData;
  file.getData(function (err, data) {
    if (err) {
      throw err;
    }
    binaryData = data;

  });
  player.addFile({name: settings, data:binaryData});
  let midiplayer = new MIDIPlayer({'output': WebMidi.getOutputById(out_id)._midiOutput});
  player.addPlayer(midiplayer);
}

export function playFromList(compositions, players, id, interval) {
  let composition = compositions[id];
  let player_instance = players[id];
  if (player_instance === '')
  {
    NotificationManager.error("No output selected to play midi", "Midi Error");
  }
  for(let player_inst of players) {
    player_inst.stop();
  }
  if(interval != 0) {
    clearInterval(interval);
  }
  let {data, name} = composition;
  let midiFile = new MIDIFile(data.buffer);
  player_instance.load(midiFile);
  let play_time = Math.round((player_instance.events.slice(-1)[0].playTime)/1000);
  console.log("Expected Playtime", play_time);
  player.setCurrentLenght(play_time);
  let countdown = setInterval(function () {
    player.tickCurrentPosition()
  }, 1000);
  player.setInterval(countdown);
  player_instance.play(function () {
    clearInterval(countdown);
  })
}

export function stopPlayback(players, id, interval) {
  for(let player_inst of players) {
    player_inst.stop();
  }
  clearInterval(interval);
}

export function createDownload(filename,text) {
  // Set up the link
  var link = document.createElement("a");
  link.setAttribute("target","_blank");
  if(Blob !== undefined) {
    var blob = new Blob([text], {type: "text/plain"});
    link.setAttribute("href", URL.createObjectURL(blob));
  } else {
    link.setAttribute("href","data:text/plain," + encodeURIComponent(text));
  }
  link.setAttribute("download",filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}