/**
 * Created by jonh on 28.10.2016.
 */
import {Component} from 'jumpsuit'
import {loadSoundFonts} from '../state/soundfont'

export default Component({
  render () {
    let {instrumentNames} = this.props;
    return (
      <div>
        { instrumentNames.map((name, index) => (
          <Led key={'led_state_' + index} name={name} index={index} />
          )
        )}

      </div>
    )
  }
}, (state) => ({
  instrumentNames: state.soundfonts.instrumentNames
}))

const Led = Component({
  render() {
    let {name, index, instrumentLedStates} = this.props;
    return (
      <div className="led-box">
        <div className={instrumentLedStates[index]}></div>
        <p>{name.slice(0,8)}</p>
      </div>
    )
  }
}, (state) => ({
  instrumentLedStates: state.soundfonts.instrumentLedStates
}));