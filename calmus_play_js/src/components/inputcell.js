/**
 * Created by jonh on 13.11.2016.
 */
import {Component} from 'jumpsuit'
import {saveInputCell} from '../state/firebase'
import inputcell, {drawInputCell} from '../state/inputcell'

export default Component({
  componentDidMount() {
    drawInputCell();
  },

  componentDidUpdate() {
    drawInputCell();
  },

  onSaveButtonClick(event) {
    event.preventDefault();
    if(!this.props.inputOpen) {
      inputcell.setKeyValue({key: 'inputOpen', value: true})
    }
    else {
      saveInputCell();
    }
  },

  render () {
    return (
      <div className={this.props.ready ? "panel panel-default" : "hidden"}>
        <div className="panel-heading">Input Cell</div>
        <div className="panel-body">
          <div className="row">
            <canvas id="inputcell" height="100px" width="500px"/>
            <div className="btn-toolbar">
              <button
                className={this.props.ready ? "btn btn-default" : "hidden"}
                onClick={this.onSaveButtonClick}
                disabled={this.props.inputOpen && !this.props.name}
              >{this.props.inputOpen ? "Confirm" :"Save"}
              </button>
              <div className="input-group col-lg-4">
                <input
                  type="text"
                  className={this.props.inputOpen ? "form-control" : "hidden"}
                  value={this.props.name}
                  onChange={(e) => inputcell.setKeyValue({key: 'name', value: e.target.value})}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}}, (state) => ({
  ready: state.inputcell.ready,
  name: state.inputcell.name,
  inputOpen: state.inputcell.inputOpen,
}))