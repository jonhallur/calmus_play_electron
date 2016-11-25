/*
 * Copyright 2012 The Closure Compiler Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Definitions for the API related to audio.
 * Definitions for the Web Audio API.
 * This file is based on the W3C Working Draft 15 March 2012.
 * @see http://www.w3.org/TR/webaudio/
 *
 * @externs
*/

/**
 * @constructor
 */
var AudioContext = function() {};

/** @type {AudioDestinationNode} */
AudioContext.prototype.destination = undefined;

/** @type {number} */
AudioContext.prototype.sampleRate = undefined;

/** @type {number} */
AudioContext.prototype.currentTime = undefined;

/** @type {AudioListener} */
AudioContext.prototype.listener = undefined;

/**
 * AudioContext.prototype.createBuffer() has 2 syntax:
 *   * Regular method:
 *     createBuffer = function(numberOfChannels, length, sampleRate) {};
 *
 *   * ArrayBuffer method:
 *     createBuffer = function(buffer, mixToMono) {};
 *
 * @param {number|ArrayBuffer} a
 * @param {number|boolean} b
 * @param {number=} sampleRate
 */
AudioContext.prototype.createBuffer = function(a, b, sampleRate) {};

/**
 * @param {ArrayBuffer} audioData
 * @param {Function} successCallback
 * @param {Function=} errorCallback
 */
AudioContext.prototype.decodeAudioData = function(audioData, successCallback,
    errorCallback) {};

/**
 * @return {AudioBufferSourceNode}
 */
AudioContext.prototype.createBufferSource = function() {};

/**
 * @param {number} bufferSize
 * @param {number} numberOfInputs
 * @param {number} numberOfOuputs
 * @return {JavaScriptAudioNode}
 */
AudioContext.prototype.createJavaScriptNode = function(bufferSize,
    numberOfInputs, numberOfOuputs) {};

/**
 * @return {RealtimeAnalyserNode}
 */
AudioContext.prototype.createAnalyser = function() {};

/**
 * @return {AudioGainNode}
 */
AudioContext.prototype.createGain =
AudioContext.prototype.createGainNode = function() {};

/**
 * @param {number=} maxDelayTime
 * @return {DelayNode}
 */
AudioContext.prototype.createDelayNode = function(maxDelayTime) {};

/**
 * @return {BiquadFilterNode}
 */
AudioContext.prototype.createBiquadFilter = function() {};

/**
 * @return {AudioPannerNode}
 */
AudioContext.prototype.createPanner = function() {};

/**
 * @return {ConvolverNode}
 */
AudioContext.prototype.createConvolver = function() {};

/**
 * @return {AudioChannelSplitter}
 */
AudioContext.prototype.createChannelSplitter = function() {};

/**
 * @return {AudioChannelMerger}
 */
AudioContext.prototype.createChannelMerger = function() {};

/**
 * @return {DynamicsCompressorNode}
 */
AudioContext.prototype.createDynamicsCompressor = function() {};

/**
 * @constructor
 */
var AudioNode = function() {};

/**
 * @param {AudioNode} destination
 * @param {number=} output
 * @param {number=} input
 */
AudioNode.prototype.connect = function(destination, output, input) {};

/**
 * @param {number=} output
 */
AudioNode.prototype.disconnect = function(output) {};

/** @type {AudioContext} */
AudioNode.prototype.context = undefined;

/** @type {number} */
AudioNode.prototype.numberOfInputs = undefined;

/** @type {number} */
AudioNode.prototype.numberOfOutputs = undefined;

/**
 * @constructor
 * @extends {AudioNode}
 * @private
 */
var AudioSourceNode = function() {};

/**
 * @constructor
 * @extends {AudioNode}
 * @private
 */
var AudioDestinationNode = function() {};

/** @type {number} */
AudioDestinationNode.prototype.numberOfChannels = undefined;

/**
 * @constructor
 * @private
 */
var AudioParam = function() {};

/** @type {number} */
AudioParam.prototype.value = undefined;

/** @type {number} */
AudioParam.prototype.maxValue = undefined;

/** @type {number} */
AudioParam.prototype.minValue = undefined;

/** @type {number} */
AudioParam.prototype.defaultValue = undefined;

/** @type {number} */
AudioParam.prototype.units = undefined;

/**
 * @param {number} value
 * @param {number} time
 */
AudioParam.prototype.setValueAtTime = function(value, time) {};

/**
 * @param {number} value
 * @param {number} time
 */
AudioParam.prototype.linearRampToValueAtTime = function(value, time) {};

/**
 * @param {number} value
 * @param {number} time
 */
AudioParam.prototype.exponentialRampToValueAtTime = function(value, time) {};

/**
 * @param {number} targetValue
 * @param {number} time
 * @param {number} timeConstant
 */
AudioParam.prototype.setTargetValueAtTime = function(targetValue, time,
    timeConstant) {};

/**
 * @param {Float32Array} values
 * @param {number} time
 * @param {number} duration
 */
AudioParam.prototype.setValueCurveAtTime = function(values, time, duration) {};

/**
 * @param {number} startTime
 */
AudioParam.prototype.cancelScheduledValues = function(startTime) {};

/**
 * @constructor
 * @extends {AudioParam}
 */
var AudioGain = function() {};

/**
 * @constructor
 * @extends {AudioNode}
 */
var AudioGainNode = function() {};

/** @type {AudioGain} */
AudioGainNode.prototype.gain = undefined;

/**
 * @constructor
 * @extends {AudioNode}
 */
var DelayNode = function() {};

/** @type {AudioParam} */
DelayNode.prototype.delayTime = undefined;

/**
 * @constructor
 */
var AudioBuffer = function() {};

/** @type {AudioGain} */
AudioBuffer.prototype.gain = undefined;

/** @type {number} */
AudioBuffer.prototype.sampleRate = undefined;

/** @type {number} */
AudioBuffer.prototype.length = undefined;

/** @type {number} */
AudioBuffer.prototype.duration = undefined;

/** @type {number} */
AudioBuffer.prototype.numberOfChannels = undefined;

/**
 * @param {number} channel
 * @return {Float32Array}
 */
AudioBuffer.prototype.getChannelData = function(channel) {};

/**
 * @constructor
 * @extends {AudioSourceNode}
 */
var AudioBufferSourceNode = function() {};

/** @type {AudioBuffer} */
AudioBufferSourceNode.prototype.buffer = undefined;

/** @type {number} */
AudioBufferSourceNode.prototype.gain = undefined;

/** @type {AudioParam} */
AudioBufferSourceNode.prototype.playbackRate = undefined;

/** @type {boolean} */
AudioBufferSourceNode.prototype.loop = undefined;

/** @type {number} */
AudioBufferSourceNode.prototype.loopStart = undefined;

/** @type {number} */
AudioBufferSourceNode.prototype.loopEnd = undefined;

/**
 * @param {number} when
 * @param {number=} offset
 * @param {number=} duration
 */
AudioBufferSourceNode.prototype.start =
AudioBufferSourceNode.prototype.noteOn = function(when, offset, duration) {};

/**
 * @param {number} when
 * @param {number} grainOffset
 * @param {number} grainDuration
 */
AudioBufferSourceNode.prototype.noteGrainOn = function(when, grainOffset,
    grainDuration) {};

/**
 * @param {number} when
 */
AudioBufferSourceNode.prototype.stop =
AudioBufferSourceNode.prototype.noteOff = function(when) {};

/**
 * @constructor
 * @extends {AudioSourceNode}
 */
var MediaElementAudioSourceNode = function() {};

/**
 * @constructor
 * @extends {AudioNode}
 */
var JavaScriptAudioNode = function() {};

/** @type {(EventListener|Function)} */
JavaScriptAudioNode.prototype.onaudioprocess = undefined;

/**
 * @const
 * @type {number}
 */
JavaScriptAudioNode.prototype.bufferSize = undefined;

/**
 * @constructor
 * @extends {Event}
 * @private
 */
var AudioProcessingEvent = function() {};

/** @type {JavaScriptAudioNode} */
AudioProcessingEvent.prototype.node = undefined;

/** @type {number} */
AudioProcessingEvent.prototype.playbackTime = undefined;

/** @type {number} */
AudioProcessingEvent.prototype.inputBuffer = undefined;

/** @type {AudioBuffer} */
AudioProcessingEvent.prototype.outputBuffer = undefined;

/**
 * @constructor
 * @extends {AudioNode}
 */
var AudioPannerNode = function() {};

/**
 * @const
 * @type {number}
 */
AudioPannerNode.prototype.EQUALPOWER = 0;

/**
 * @const
 * @type {number}
 */
AudioPannerNode.prototype.HRTF = 1;

/**
 * @const
 * @type {number}
 */
AudioPannerNode.prototype.SOUNDFIELD = 2;

/**
 * @const
 * @type {number}
 */
AudioPannerNode.prototype.LINEAR_DISTANCE = 0;

/**
 * @const
 * @type {number}
 */
AudioPannerNode.prototype.INVERSE_DISTANCE = 1;

/**
 * @const
 * @type {number}
 */
AudioPannerNode.prototype.EXPONENTIAL_DISTANCE = 2;

/** @type {number} */
AudioPannerNode.prototype.panningModel = undefined;

/**
 * @param {number} x
 * @param {number} y
 * @param {number} z
 */
AudioPannerNode.prototype.setPosition = function(x, y, z) {};

/**
 * @param {number} x
 * @param {number} y
 * @param {number} z
 */
AudioPannerNode.prototype.setOrientation = function(x, y, z) {};

/**
 * @param {number} x
 * @param {number} y
 * @param {number} z
 */
AudioPannerNode.prototype.setVelocity = function(x, y, z) {};

/** @type {number} */
AudioPannerNode.prototype.distanceModel = undefined;

/** @type {number} */
AudioPannerNode.prototype.refDistance = undefined;

/** @type {number} */
AudioPannerNode.prototype.maxDistance = undefined;

/** @type {number} */
AudioPannerNode.prototype.rolloffFactor = undefined;

/** @type {number} */
AudioPannerNode.prototype.coneInnerAngle = undefined;

/** @type {number} */
AudioPannerNode.prototype.coneOuterAngle = undefined;

/** @type {number} */
AudioPannerNode.prototype.coneOuterGain = undefined;

/** @type {AudioGain} */
AudioPannerNode.prototype.coneGain = undefined;

/** @type {AudioGain} */
AudioPannerNode.prototype.distanceGain = undefined;

/**
 * @constructor
 */
var AudioListener = function() {};

/** @type {number} */
AudioListener.prototype.gain = undefined;

/** @type {number} */
AudioListener.prototype.dopplerFactor = undefined;

/** @type {number} */
AudioListener.prototype.speedOfSound = undefined;

/**
 * @param {number} x
 * @param {number} y
 * @param {number} z
 */
AudioListener.prototype.setPosition = function(x, y, z) {};

/**
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @param {number} xUp
 * @param {number} yUp
 * @param {number} zUp
 */
AudioListener.prototype.setOrientation = function(x, y, z, xUp, yUp, zUp) {};

/**
 * @param {number} x
 * @param {number} y
 * @param {number} z
 */
AudioListener.prototype.setVelocity = function(x, y, z) {};

/**
 * @constructor
 * @extends {AudioNode}
 */
var ConvolverNode = function() {};

/** @type {AudioBuffer} */
ConvolverNode.prototype.buffer = undefined;

/** @type {boolean} */
ConvolverNode.prototype.normalize = undefined;

/**
 * @constructor
 * @extends {AudioNode}
 */
var RealtimeAnalyserNode = function() {};

/**
 * @param {Float32Array} array
 */
RealtimeAnalyserNode.prototype.getFloatFrequencyData = function(array) {};

/**
 * @param {Uint8Array} array
 */
RealtimeAnalyserNode.prototype.getByteFrequencyData = function(array) {};

/**
 * @param {Uint8Array} array
 */
RealtimeAnalyserNode.prototype.getByteTimeDomainData = function(array) {};

/** @type {number} */
RealtimeAnalyserNode.prototype.fftSize = undefined;

/** @type {number} */
RealtimeAnalyserNode.prototype.frequencyBinCount = undefined;

/** @type {number} */
RealtimeAnalyserNode.prototype.minDecibels = undefined;

/** @type {number} */
RealtimeAnalyserNode.prototype.maxDecibels = undefined;

/** @type {number} */
RealtimeAnalyserNode.prototype.smoothingTimeConstant = undefined;

/**
 * @constructor
 * @extends {AudioNode}
 */
var AudioChannelSplitter = function() {};

/**
 * @constructor
 * @extends {AudioNode}
 */
var AudioChannelMerger = function() {};

/**
 * @constructor
 * @extends {AudioNode}
 */
var DynamicsCompressorNode = function() {};

/** @type {AudioParam} */
DynamicsCompressorNode.prototype.threshold = undefined;

/** @type {AudioParam} */
DynamicsCompressorNode.prototype.knee = undefined;

/** @type {AudioParam} */
DynamicsCompressorNode.prototype.ratio = undefined;

/** @type {AudioParam} */
DynamicsCompressorNode.prototype.reduction = undefined;

/** @type {AudioParam} */
DynamicsCompressorNode.prototype.attack = undefined;

/** @type {AudioParam} */
DynamicsCompressorNode.prototype.release = undefined;

/**
 * @constructor
 * @extends {AudioNode}
 */
var BiquadFilterNode = function() {};

/**
 * @const
 * @type {number}
 */
BiquadFilterNode.prototype.LOWPASS = 0;

/**
 * @const
 * @type {number}
 */
BiquadFilterNode.prototype.HIGHPASS = 1;

/**
 * @const
 * @type {number}
 */
BiquadFilterNode.prototype.BANDPASS = 2;

/**
 * @const
 * @type {number}
 */
BiquadFilterNode.prototype.LOWSHELF = 3;

/**
 * @const
 * @type {number}
 */
BiquadFilterNode.prototype.HIGHSHELF = 4;

/**
 * @const
 * @type {number}
 */
BiquadFilterNode.prototype.PEAKING = 5;

/**
 * @const
 * @type {number}
 */
BiquadFilterNode.prototype.NOTCH = 6;

/**
 * @const
 * @type {number}
 */
BiquadFilterNode.prototype.ALLPASS = 7;

/** @type {number} */
BiquadFilterNode.prototype.type = undefined;

/** @type {AudioParam} */
BiquadFilterNode.prototype.frequency = undefined;

/** @type {AudioParam} */
BiquadFilterNode.prototype.Q = undefined;

/** @type {AudioParam} */
BiquadFilterNode.prototype.gain = undefined;

/**
 * @param {Float32Array} frequencyHz
 * @param {Float32Array} magResponse
 * @param {Float32Array} phaseResponse
 */
BiquadFilterNode.prototype.getFrequencyResponse = function(frequencyHz,
    magResponse, phaseResponse) {};

/**
 * @constructor
 * @extends {AudioNode}
 */
var WaveShaperNode = function() {};

/** @type {Float32Array} */
WaveShaperNode.prototype.curve = undefined;

/**
 * Definitions for the Web Audio API with webkit prefix.
 */

/**
 * @constructor
 * @extends {AudioContext}
 */
var webkitAudioContext = function() {};

/**
 * @constructor
 * @extends {AudioPannerNode}
 */
var webkitAudioPannerNode = function() {};

/**
 * Definitions for the Audio API as implemented in Firefox.
 *   Please note that this document describes a non-standard experimental API.
 *   This API is considered deprecated.
 * @see https://developer.mozilla.org/en/DOM/HTMLAudioElement
 */

/**
 * @param {string=} src
 * @constructor
 */
var Audio = function(src) {};

/**
 * @param {number} channels
 * @param {number} rate
 */
Audio.prototype.mozSetup = function(channels, rate) {};

/**
 * @param {Array|Float32Array} buffer
 */
Audio.prototype.mozWriteAudio = function(buffer) {};

/**
 * @return {number}
 */
Audio.prototype.mozCurrentSampleOffset = function() {};
