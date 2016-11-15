/**
 * Created by jonh on 15.11.2016.
 */
import {Component} from 'jumpsuit'

export default Component({
    componentDidMount() {

    },

    componentDidUpdate() {

    },

    render() {
        return (
            <canvas
                width="32px"
                height="32px"
                style={{display: this.props.waitingForCalmus ? 'inline' : 'none'}}
            />
        )
    }
}, (state) => ({
    waitingForCalmus: state.uistate.waitingForCalmus,

}))