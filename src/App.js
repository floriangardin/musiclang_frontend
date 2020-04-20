import React, { Component } from 'react';
import './App.css';
import Player from "./Player";
import Sequencer from "./Sequencer";
import ContextMenu from "./ContextMenu/ContextMenu";

class App extends Component {

    render() {
        return (
            <div className="App">
                <Sequencer></Sequencer>
            </div>

        );
    }
}

export default App;