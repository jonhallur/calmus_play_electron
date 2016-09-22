/**
 * Created by jonh on 22.9.2016.
 */
import {State} from 'jumpsuit'


const player = State('player', {
  initial: {
    files:[],
    ready: false,
    playing: false,
    current: {name: '', file: {}, length: 0}
  },

  addFile (state, payload) {
    state.files.push(payload);
    return { files: state.files };
  },

  removeFile (state, payload) {
    state.files.remove(payload);
    return { files: state.files };
  },

  setCurrent: (state, payload) => ({
    current: payload
  })
});

export default player