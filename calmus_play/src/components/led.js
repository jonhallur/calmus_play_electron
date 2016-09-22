export default (props) => {
  return (
    <div className="led-box">
      <div className={props.state ? 'led-green' : 'led-gray'}></div>
      <div className="led-label">
        <p className="label label-default">{props.label}</p>
      </div>
    </div>
  )
}
