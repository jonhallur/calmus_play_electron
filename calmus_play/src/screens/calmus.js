/**
 * Created by jonh on 16.9.2016.
 */
import {Component} from 'jumpsuit'
import Option from '../components/input/options'
import uistate from '../state/ui'
import {sendCalmusRequest} from '../state/calmus'

export function eventValueHandler(func, event) {
  func(event.target.value);
}

export default Component({
  componentDidMount() {
    uistate.setTranspose(0);
    uistate.setSpeed(0);
    uistate.setSize('');
    uistate.setColor('');
    uistate.setInteval('');
    uistate.setPolyphony('');
    uistate.setScale('');
  },

  onComposeClick(event) {
    event.preventDefault();
    let values = [
      this.props.transposeValue,
      this.props.speedValue,
      this.props.sizeValue,
      this.props.colorValue,
      this.props.intervalValue,
      this.props.polyphonyValue,
      this.props.scaleValue,
    ];
    let valueString = values.join('/');
    console.log("valuestring =>", valueString);
    sendCalmusRequest(valueString);

  },

  render() {
    return (
      <div>
      <form className="form-horizontal">
        <div className="form-group">
          <label className="col-sm-1 control-label" htmlFor="Transpose">Transpose</label>
          <div className="col-sm-9">
            <input
              className=""
              id="transpose"
              type="range"
              min="-20"
              max="20"
              step="1"
              value={this.props.transposeValue}
              onChange={eventValueHandler.bind(this, uistate.setTranspose)}
            />
          </div>
          <div className="col-sm-2">
            <input className="form-control" readOnly value={this.props.transposeValue} />
          </div>
        </div>
        <div className="form-group">
          <label className="col-sm-1" htmlFor="speed">Speed</label>
          <div className="col-sm-9">
            <input
              className=""
              id="speed"
              type="range"
              min="-100"
              max="1000"
              step="1"
              value={this.props.speedValue}
              onChange={eventValueHandler.bind(this, uistate.setSpeed)}
            />
          </div>
          <div className="col-sm-2">
            <input className="form-control" readOnly value={this.props.speedValue} />
          </div>
        </div>
        <Option
          data={this.props.sizeOptions}
          label="Type"
          id="size"
          value={this.props.sizeValue}
          default_text="Select Composition Type"
          eventhandler={eventValueHandler.bind(this, uistate.setSize)}
          offset="1"

        />
        <Option
          data={this.props.colorOptions}
          label="Color"
          id="color"
          value={this.props.colorValue}
          default_text="Select Composition Color"
          eventhandler={eventValueHandler.bind(this, uistate.setColor)}
          offset="1"
        />
        <Option
          data={this.props.intervalOptions}
          label="Interval"
          id="interval"
          value={this.props.intervalValue}
          default_text="Select Harmony Interval"
          eventhandler={eventValueHandler.bind(this, uistate.setInteval)}
          offset="2"
        />
        <Option
          data={this.props.polyphonyOptions}
          label="Polyphony"
          id="polyphony"
          value={this.props.polyphonyValue}
          default_text="Select Harmony Polyphony"
          eventhandler={eventValueHandler.bind(this, uistate.setPolyphony)}
          offset="1"
        />
        <Option
          data={this.props.scaleOptions}
          label="Scale"
          id="scale"
          value={this.props.scaleValue}
          default_text="Select Scale"
          eventhandler={eventValueHandler.bind(this, uistate.setScale)}
          offset="0"
        />
        <div className="form-group col-sm-12">
          <button className="btn btn-default" id="callCalmus" onClick={this.onComposeClick}>Compose</button>
        </div>
      </form>
        <input readOnly placeholder="Attack list" className="form-control" id="attacklist" type="text" value={this.props.attackList} />
        <input readOnly placeholder="Channel list" className="form-control" id="channelslist" type="text" value={this.props.channelsList} />
        <input readOnly placeholder="Pitch list" className="form-control" id="pitchlist" type="text" value={this.props.pitchList} />
        <input readOnly placeholder="Duration list" className="form-control" id="durationlist" type="text" value={this.props.durationList} />
        <input readOnly placeholder="Velocity list" className="form-control" id="velocitylist" type="text" value={this.props.velocityList} />
      </div>
    )
  }
}, (state) => ({
  sizeOptions: state.uistate.size,
  colorOptions: state.uistate.color,
  intervalOptions: state.uistate.interval,
  polyphonyOptions: state.uistate.polyphony,
  scaleOptions: state.uistate.scale,
  transposeValue: state.uistate.transposeValue,
  speedValue: state.uistate.speedValue,
  sizeValue: state.uistate.sizeValue,
  colorValue: state.uistate.colorValue,
  intervalValue: state.uistate.intervalValue,
  polyphonyValue: state.uistate.polyphonyValue,
  scaleValue: state.uistate.scaleValue,
  attackList: state.calmusstate.attackList,
  channelsList: state.calmusstate.channelsList,
  pitchList: state.calmusstate.pitchList,
  durationList: state.calmusstate.durationList,
  velocityList: state.calmusstate.velocityList,
}))