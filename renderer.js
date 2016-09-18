// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var net = require('net');
var calmusState = window.calmusstate;

var client = new net.Socket();
client.connect(9001, "89.160.214.32", function() {
  console.log('Connected');
});

client.on('data', function(data) {
  console.log('Received: ' + data);
});

client.on('close', function() {
  console.log('Connection closed');
});

document.getElementById('callCalmus').addEventListener('click', function(event) {
  event.preventDefault();
  let values = collectValues();
  let isValid = values.every(elem => !isNaN(elem));
  if (isValid) {
    console.log("is Valid");
    client.write(new Buffer(values.join(' ')));
    calmusState.setAttackList(values);
  }
  else {
    console.log("is invalid");
  }
});

function collectValues() {
  var value_ids = [
    "transpose",
    "speed",
    "size",
    "color",
    "interval",
    "polyphony",
    "scale",
  ];

  var values = [];
  value_ids.map(id => values.push(getValue(id)));
  return values;
}


function getValue(id) {
  return document.getElementById(id).value
}

function str2ab(str) {
  var buf = new ArrayBuffer(str.length*2);
  var bufView = new Uint8Array(buf);
  for (var i=0, strLen=str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}
