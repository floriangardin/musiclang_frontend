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
            midi_to_play: [{pitch: 60, duration: 2.5, offset:1, track: 1, volume:100},
                {pitch: 64, duration: 2.5, offset:2, track: 1, volume: 70},
                {pitch: 67, duration: 2.5, offset:3, track: 1, volume: 20},
                {pitch: 67, duration: 2.5, offset:4, track: 1, volume: 10}
            ],
            instruments: {0: 3, 1:3 },
            tempo: 120,
            currentOffset: 0,
            startTime: 0,
            durationQuarter: 0.5,
        };
    }

    componentDidMount() {

    }

    loadScoreFromBackend(){
        fetch("http://localhost:5000/")
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result);
                    this.setState({
                        instruments: result.instruments,
                        tempo: result.tempo,
                        midi_to_play: result.score
                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }

    stop(){
        this.midiSounds.cancelQueue();
        this.setState({currentOffset: 0});
    }

    downloadMidi(){

    }
    pause(){
        this.midiSounds.cancelQueue();
        this.setState({
            currentOffset: (this.midiSounds.audioContext.currentTime
                - this.state.startTime)/this.state.durationQuarter})
    }

    play() {
        // Request backend return json
        // If the user want he can download the midi file from the backend
        this.midiSounds.setMasterVolume(0.3);
        this.midiSounds.cancelQueue();
        let bpm = this.state.tempo;
        let N = 4 * 60 / bpm;
        let durationQuarter = N/4;
        let startTime = this.midiSounds.audioContext.currentTime;
        this.setState({startTime: startTime, durationQuarter: durationQuarter})
        for(let i=0; i < this.state.midi_to_play.length; i++){
            let toPlay = this.state.midi_to_play[i];
            if(toPlay.offset >= this.state.currentOffset){
                let currentOffset = this.state.currentOffset;
                this.midiSounds.playChordAt(startTime + (toPlay.offset - currentOffset)* durationQuarter,
                    this.state.instruments[toPlay.track],
                    [toPlay.pitch], toPlay.duration, toPlay.volume);
            }
        }
    }

    render() {
        return (
            <div className="App">
                <p><button onClick={this.loadScoreFromBackend.bind(this)}>Load</button></p>
                <p><button onClick={this.play.bind(this)}>Play</button></p>
                <p><button onClick={this.pause.bind(this)}>Pause</button></p>
                <p><button onClick={this.stop.bind(this)}>Stop</button></p>
                <p><button onClick={this.downloadMidi.bind(this)}>Download midi</button></p>
                <MIDISounds ref={(ref) => (this.midiSounds = ref)} appElementName="root" instruments={[3]} />
            </div>
        );
    }
}

export default App;