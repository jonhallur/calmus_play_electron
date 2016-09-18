import { Component } from 'jumpsuit'

export default Component({
  render () {
    return (
      <div className='container'>
        <h1>CalMus Play</h1>
          {this.props.children}
      </div>
    )
  }
})
