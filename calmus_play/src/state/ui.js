import {State} from 'jumpsuit'

const uiState = State('uistate', {
  initial: {
    transposeValue: 0,
    speedValue: 850,
    rhythmComplexity: 0.5,
    sizeValue: {},
    colorValue: {},
    intervalValue: {},
    polyphonyValue: {},
    addWood: true,
    addBrass: false,
    addStrings: false,
    addPercussion: false,
    scaleValue: '',
    size: ["Solo", "Duo", "Trio", "Quartet", "Quintet"],
    color: ["Blue", "Purple", "Red", "Orange", "Yellow", "Green"],
    interval: ["Two", "Three", "Four", "Five", "Six", "Seven"],
    polyphony: ["Individual", "Canon", "Horizontal/Vertical", "Homophonic"],
    scale: [
      "Chromatic",
      "Ionian-Major*",
      "Dorian",
      "Phrygian*",
      "Lydian*",
      "Mixolydian",
      "Aeolian-Minor",
      "Locrian",
      "Super-Locrian",
      "Neapolitan-Minor",
      "Neapolitan-Major",
      "Oriental",
      "Double-Harmonic",
      "Hungarian-Minor",
      "Major-Locrian",
      "Lydian-Minor",
      "Lydian-Major",
      "Leading-Whole-tone",
      "Enigmatic",
      "Hungarian-Major",
      "Eight-tone-Spanish",
      "Symmetrical-I",
      "Symmetrical-II",
      "Pentatonic",
      "Pelog",
      "Hirajoshi",
      "Kumoi",
      "Six-tone-symmetrical",
      "Prometheus",
      "Prometheus-Neapolitian",
      "Whole-tone",
      "Overtone"
    ]
  },

  setKeyValue: (state, payload) => ({
    [payload.key]: payload.value
  }),

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