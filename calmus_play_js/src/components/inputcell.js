/**
 * Created by jonh on 13.11.2016.
 */
import {Component} from 'jumpsuit'

export default Component({
    render () {
      return (
        <div className={this.props.ready ? "panel panel-default" : "hidden"}>
          <div className="panel-heading">Input Cell</div>
          <div className="panel-body">
            <canvas id="inputcell" height="100px" width="500px"/>
          </div>
        </div>
      )
}}, (state) => ({
  ready: state.inputcell.ready,
}))