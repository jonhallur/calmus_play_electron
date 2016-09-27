/**
 * Created by jonh on 26.9.2016.
 */
export default class MidiEvent {
  constructor(attack, channel, pitch, duration, velocity) {
    this.attack = attack;
    this.channel = channel;
    this.pitch = pitch;
    this.duration = duration;
    this.velocity = velocity;
  }
}