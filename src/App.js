import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Composer from "./Composer";
import Player from "./Player";

class App extends Component {


    render() {
        return (
            <div className="App">
                <Composer></Composer>
                <Player></Player>
            </div>
        );
    }
}

export default App;