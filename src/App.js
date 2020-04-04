import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import MIDISounds from 'midi-sounds-react';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            items: [],
            midi_to_play: [{pitch: [60], duration: 2.5, time:1, track: 1}],
            instruments: {0: 3, 1:3 },
            tempo: 120
        };
    }

    componentDidMount() {

    }

    loadScoreFromBackend(){

    }

    playTestInstrument() {
        // Request backend return json
        // If the user want he can download the midi file from the backend
        let track_context = this.state.midi_to_play[i];
        for(var i=0; i<this.props.state; i++){
            let to_play = this.state.midi_to_play[i];
            this.midiSounds.playChordAt(to_play.time, this.state.instruments[to_play.track],
                to_play.pitch, to_play.duration);
        }
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="App-title">Welcome to midi-sounds-react example 1</h1>
                </header>
                <p className="App-intro">Press Play to play instrument sound.</p>
                <p><button onClick={this.playTestInstrument.bind(this)}>Play</button></p>
                <MIDISounds ref={(ref) => (this.midiSounds = ref)} appElementName="root" instruments={[3]} />
            </div>
        );
    }
}

export default App;