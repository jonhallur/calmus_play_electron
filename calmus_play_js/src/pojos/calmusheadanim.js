/**
 * Created by jonh on 15.11.2016.
 */
var timerHandle = null;
var pixel_width = 128;
var animspeed = 20;
var step = 4;
var image = new Image();
image.src = './calmus_head.png';


export function updateDrawState(shouldUpdate) {
  if (shouldUpdate) {
    timerHandle = setTimeout(drawCalmusHead, animspeed);
  }
  else {
    clearTimeout(timerHandle);
  }
}

function drawCalmusHead() {
  let canvas = document.getElementById('calmushead');
  let ctx = canvas.getContext('2d');
  ctx.clearRect(0,0,canvas.width,canvas.height);

  let canvas_size = canvas.width;
  let x = 0;
  let y = 0;
  let width = Math.abs(pixel_width-(canvas_size-pixel_width));
  let height = canvas_size;

  ctx.save();
  if(pixel_width < canvas_size/2) {
    ctx.scale(-1,1);
  }
  else {
    ctx.scale(1,1);
  }
  let transX = pixel_width > 64 ? (canvas_size-pixel_width)/2 : (pixel_width-canvas_size)/2;
  //console.log(pixel_width, x,y,width,height, transX);
  ctx.translate(transX, 0);
  ctx.drawImage(image,0,0,image.width,image.height,transX,y,width,height);

  pixel_width -= step;
  if (pixel_width === 0){
    step *= -1;
  }
  else if (pixel_width === 128) {
    step *= -1;
  }

  ctx.restore();
  timerHandle = setTimeout(drawCalmusHead, 100);
}
