import {State} from 'jumpsuit'

const uiState = State('uistate', {
  initial: {
    transposeValue: 0,
    speedValue: 0,
    sizeValue: {},
    colorValue: {},
    intervalValue: {},
    polyphonyValue: {},
    scaleValue: '',
    size: ["Solo", "Duo", "Trio", "Quartet", "Quintet", "Sextet"],
    color: ["Blue", "Purple", "Red", "Orange", "Yellow", "Green"],
    interval: ["Two", "Three", "Four", "Five", "Six", "Seven"],
    polyphony: ["Individual", "Canon", "Horizontal/Vertical", "Homophonic"],
    scale: [
      "Chromatic",
      "Ionian Major*",
      "Dorian",
      "Phrygian*",
      "Lydian*",
      "Mixolydian",
      "Aeolian Minor",
      "Locrian",
      "Super Locrian",
      "Neapolitan Minor",
      "Neapolitan Major",
      "Oriental",
      "Double Harmonic",
      "Hungarian Minor",
      "Major Locrian",
      "Lydian Minor",
      "Lydian Minor",
      "Leading Whole  Tone",
      "Hungarian Major",
      "Eight  Tone Spanish",
      "Symmetrical I",
      "Symmetrical II",
      "Pentatonic",
      "Pelog",
      "Hirajoshi",
      "Kumoi",
      "Six Tone Symmetrical",
      "Prometheus",
      "Prometheus Neapolitian",
      "Whole  Tone",
      "Over Tone"
    ]
  },
  setTranspose: (state, payload) => ({
    transposeValue: payload
  }),
  setSpeed: (state, payload) => ({
    speedValue: payload
  }),
  setSize: (state, payload) => ({
    sizeValue: payload
  }),
  setColor: (state, payload) => ({
    colorValue: payload
  }),
  setInteval: (state, payload) => ({
    intervalValue: payload
  }),
  setPolyphony: (state, payload) => ({
    polyphonyValue: payload
  }),
  setScale: (state, payload) => ({
    scaleValue: payload
  }),
});

export default uiState