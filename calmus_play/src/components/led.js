export default (props) => {
  return (
    <div className="led-box">
      <div className={props.state ? 'led-green' : 'led-gray'}></div>
      <p>{props.label}</p>
    </div>
  )
}
