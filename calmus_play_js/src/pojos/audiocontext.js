/**
 * Created by jonh on 28.11.2016.
 */
var ctx = undefined;

export default function getAudioContext() {
  if (ctx !== undefined) {
    return ctx
  }

  if (window.AudioContext !== void 0) {
    ctx = new AudioContext();
  } else if (window.webkitAudioContext !== void 0) {
    ctx = new webkitAudioContext();
  } else if (window.mozAudioContext !== void 0) {
    ctx = new mozAudioContext();
  } else {
    throw new Error('Web Audio not supported');
  }

  if (ctx.createGainNode === void 0) {
    ctx.createGainNode = ctx.createGain;
  }

  return ctx;
}