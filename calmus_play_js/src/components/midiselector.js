/**
 * Created by jonh on 22.9.2016.
 */
import {Component} from 'jumpsuit'
import {setMidiInput, setMidiOutput} from '../state/midi'
import uistate from '../state/ui'

export default Component({
  onMidiInChanged(event) {
    let in_id = event.target.value;
    setMidiInput(in_id);
  },
  onMidiOutChanged(event) {
    let out_id = event.target.value;
    setMidiOutput(out_id, this.props.midi_player);
  },

  render () {
      return (
        <div>
          <div className="form-group col-sm-2">
            <label className="col-sm-12 control-label" htmlFor="midi_inputs">MIDI Inputs</label>
            <select className="form-control" name="midi_inputs" value={this.props.midi_in_id} onChange={this.onMidiInChanged}>
              <option disabled value>Select MIDI In</option>
              {
                this.props.midiIns.map(input => (
                  <option key={input.id} value={input.id}>{input.name}</option>
                ))
              }
            </select>
          </div>

          <div className="form-group col-sm-2">
            <label htmlFor="midi_inputs">MIDI Outputs</label>
            <select className="form-control" name="midi_inputs" value={this.props.midi_out_id} onChange={this.onMidiOutChanged}>
              <option disabled value>Select MIDI Out</option>
              {
                this.props.midiOuts.map(input => (
                  <option key={input.id} value={input.id}>{input.name}</option>
                ))
              }
            </select>
          </div>
          <label className="checkbox-inline">
            <input
              type="checkbox"
              checked={this.props.useInternal}
              onChange={e => uistate.setKeyValue({key: 'useInternal', value: e.target.checked})}
            />Use Internal Sounds
          </label>&nbsp;&nbsp;&nbsp;

        </div>
      )
  }
}, (state) => ({
  midiAvailable: state.midistate.available,
  midiIns: state.midistate.ins,
  midiOuts: state.midistate.outs,
  midi_in_id: state.midistate.in_id,
  midi_out_id: state.midistate.out_id,
  midi_player: state.midi_player.player,
  useInternal: state.uistate.useInternal
}))