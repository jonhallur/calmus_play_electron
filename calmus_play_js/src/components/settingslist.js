/**
 * Created by jonh on 30.9.2016.
 */
import {Component} from 'jumpsuit'
import ui from '../state/ui'
import {deleteSettings} from '../state/firebase'
import inputcell, {setInputCell} from '../state/inputcell'
import {sendCalmusRequest} from '../state/calmus'
import {addPlayerFile} from '../state/player'

const type_to_function = {
  savedSettingsList: setSettingsValues,
  savedInputcellsList: setInputcell,
  savedCompositionsList: setComposition,
};

const type_to_firebasepath = {
  savedSettingsList: 'settings',
  savedInputcellsList: 'inputcells',
  savedCompositionsList: 'compositions',
};

function setSettingsValues(key, list) {
  for (let setting of list) {
    if (setting.uid === key) {
      let {
        transpose,
        speed,
        rhythmComplexity,
        size,
        color,
        interval,
        polyphony,
        scale,
        addWood,
        addBrass,
        addStrings,
        addPercussion,
        melodyStrong,
        harmonyStrong,
      } = setting;

      ui.setTranspose(transpose);
      ui.setSpeed(speed);
      ui.setKeyValue({key: 'rhythmComplexity', value: rhythmComplexity});
      ui.setSize(size);
      ui.setColor(color);
      ui.setInteval(interval);
      ui.setPolyphony(polyphony);
      ui.setScale(scale);
      ui.setKeyValue({key: 'addWood', value: addWood});
      ui.setKeyValue({key: 'addBrass', value: addBrass});
      ui.setKeyValue({key: 'addStrings', value: addStrings});
      ui.setKeyValue({key: 'addPercussion', value: addPercussion});
      ui.setKeyValue({key: 'melodyStrong', value: melodyStrong});
      ui.setKeyValue({key: 'harmonyStrong', value: harmonyStrong});
    }
  }
}

function setInputcell(key, list) {
  for (let cell of list) {
    if (cell.uid === key) {
      let {eventList, name} = cell;
      setInputCell(eventList);
      inputcell.setKeyValue({key: 'name', value: name});
      ui.setPolyphony(1);
      sendCalmusRequest(true, true);
    }
  }
}

function setComposition(key, list) {
  for (let comp of list) {
    if (comp.uid === key) {
      addPlayerFile(comp)
    }
  }
}

export default Component({
  onItemClick (event) {
    event.preventDefault();
    let key = event.target.id;
    let list = this.props[this.props.type];
    type_to_function[this.props.type](key, list)
  },

  onRemoveBadgeClick(event) {
    event.preventDefault();
    event.stopPropagation();
    let id = event.target.id;
    deleteSettings(id, type_to_firebasepath[this.props.type]);
  },

  render () {
    let library = this.props[this.props.type];
    return (
      <div className="list-group">
        {library.map((settings, index) => (
          <a className="list-group-item" id={settings.uid} key={settings.uid} onClick={this.onItemClick}>
                {settings.name}
              <span id={settings.uid} className="badge">
                <span id={settings.uid} className="white-glyph glyphicon glyphicon-remove" aria-hidden="true" onClick={this.onRemoveBadgeClick}/>
            </span>
          </a>
        ))}
      </div>
    )
  }
}, (state) => ({
  savedSettingsList: state.firestate.savedSettingsList,
  savedInputcellsList: state.firestate.savedInputcellsList,
  savedCompositionsList: state.firestate.savedCompositionsList,
  userUid: state.firestate.userUid
}))
