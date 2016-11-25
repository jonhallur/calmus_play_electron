/**
 * Created by jonh on 28.10.2016.
 */
import {Component} from 'jumpsuit'
import Modal from 'react-modal'
import soundfonts from '../state/soundfont'

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

export default Component({
  render () {
    return (
      <div>
        <Modal
          isOpen={!this.props.ready}
          style={customStyles} >

          <h2 ref="subtitle">Please wait while sounds are loading</h2>
            <p>{this.props.loadingText} - {this.props.loadingPercentage} %</p>
        </Modal>
      </div>
    )
  }
}, (state) => ({
  loadingText: state.soundfonts.loadingText,
  loadingPercentage: state.soundfonts.loadingPercentage,
  ready: state.soundfonts.ready,
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
  instrumentLedStates: state.soundfonts.instrumentLedStates,

}));