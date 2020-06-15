import React, { Component } from 'react';
import './Player.css';
import MIDISounds from "midi-sounds-react";
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
class Player extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      currentOffset: 0,
      startTime: 0,
      durationQuarter: 0.5,
    };
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
    this.midiSounds.setEchoLevel(0.1);
    this.midiSounds.cancelQueue();
    let bpm = this.props.score.tempo;
    let N = 4 * 60 / bpm;
    let durationQuarter = N/4;
    let startTime = this.midiSounds.audioContext.currentTime;
    this.setState({startTime: startTime, durationQuarter: durationQuarter})
    for(let i=0; i < this.props.score.midi_to_play.length; i++){
      let toPlay = this.props.score.midi_to_play[i];
      if(toPlay.offset >= this.state.currentOffset){
        let currentOffset = this.state.currentOffset;
        this.midiSounds.playChordAt(startTime + (toPlay.offset - currentOffset)* durationQuarter,
            this.props.score.instruments[toPlay.track],
            [toPlay.pitch], toPlay.duration, toPlay.volume);
      }
    }
  }

  render() {
    return (
          <div className="player">
            <div hidden={!this.props.loading} className="loader center">
              <i className="fa fa-cog fa-spin" />
            </div>
            <ButtonGroup color="primary" aria-label="outlined primary button group">
              <Button onClick={this.props.loadScoreFromBackend}>Load</Button>
              <Button onClick={this.play.bind(this)}>Play</Button>
              <Button onClick={this.pause.bind(this)}>Pause</Button>
              <Button onClick={this.stop.bind(this)}>Stop</Button>
              <Button onClick={this.downloadMidi.bind(this)}>Download midi</Button>
            </ButtonGroup>
            <div className="hidden">
              <MIDISounds ref={(ref) => (this.midiSounds = ref)} appElementName="root" instruments={[3]}/>
            </div>
          </div>
    );
  }
}

export default Player;