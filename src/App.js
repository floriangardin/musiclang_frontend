import React, { Component } from 'react';
import './App.css';
import Player from "./Player";
import Sequencer from "./Sequencer";

class App extends Component {

    render() {
        return (
            <div className="App">
                <Sequencer></Sequencer>
                <Player></Player>
            </div>

        );
    }
}

export default App;