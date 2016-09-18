// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
console.log("renderer")

const TCPBase = require('tcp-base');

class Client extends TCPBase {
  getHeader() {
    return this.read(8);
  }

  getBodyLength(header) {
    return header.readInt32BE(4);
  }

  decode(body, header) {
    return {
      id: header.readInt32BE(0),
      data: body,
    };
  }

  // heartbeat packet
  get heartBeatPacket() {
    return new Buffer([ 255, 255, 255, 255, 0, 0, 0, 0 ]);
  }
}

const client = new Client({
  host: "89.160.214.32",
  port: 9001,
});

document.getElementById('callCalmus').addEventListener('click', function(event) {
  event.preventDefault();
  let values = collectValues().join(' ');
  console.log("values =>", values)
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
