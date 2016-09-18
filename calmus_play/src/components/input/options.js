/**
 * Created by jonh on 18.9.2016.
 */
import {Component} from 'jumpsuit'

export default Component({
  render() {
    return (
      <div className="form-group col-sm-4">
        <label htmlFor={this.props.id} className="col-sm-3 control-label">{this.props.label}</label>
        <div className="col-sm-9">
          <select className="form-control" id={this.props.id} value={this.props.value} onChange={this.props.eventhandler} >
            <option disabled value>{this.props.default_text}</option>
            {this.props.data.map((option, index) =>
              <Option key={index} id={index} name={option}/>
            )}
          </select>
        </div>
      </div>
    );
  }
})

const Option = Component({
  render() {
    return (
      <option key={this.props.id} value={this.props.id}>{this.props.name}</option>
    )
  }
});