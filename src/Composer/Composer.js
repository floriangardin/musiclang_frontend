import React, { Component } from 'react';
import './Composer.css';
import Dropdown from "react-bootstrap/Dropdown";
import {Container, DropdownButton} from "react-bootstrap";
import Element from "./Element";
import Button from "react-bootstrap/Button";
import DragComposer from "../DragComposer";
import {DragDropContext, Draggable} from "react-beautiful-dnd";


class Composer extends Component {
  constructor(props){
    super(props);
    this.noteCandidates = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    this.modeCandidates = ["Major", "Minor natural", "Minor Harmonic", "Minor Melodic",
        "Dorian", "Phrygian", "Lydian", "Mixolydian", "Locrian", "Whole tone"];
    this.styleCandidates = ['Chopin', 'Beethoven', 'Bach', 'Rachmaninov'];
    this.chordCandidates = [
        'i', 'ib', 'i#',
        'iib', 'ii', 'ii#',
        'iiib', 'iii', 'iii#',
        'ivb', 'iv', 'iv#',
        'vb', 'v', 'v#',
        'vib', 'vi', 'vi#',
        'viib', 'vii', 'vii#',
    ]
  this.durationCandidates = [
      'double whole', 'whole'
  ]

    this.elementTypes = ["mode", "note", "style", "chord", "duration"];
    this.candidateGivenType = {"mode": this.modeCandidates, "note": this.noteCandidates,
        "style": this.styleCandidates, "chord": this.chordCandidates, "duration": this.durationCandidates};
    this.state = {display: false, score: [], maxId: 0};
    this.refDragComposer = React.createRef();
  }

  // componentWillMount(){}
  componentDidMount(){

      const node = this.refDragComposer.current;
      node.addRow();
      ["mode", "note", "style", "chord", "duration", "mode", "note", "style", "chord", "duration"].forEach(
          (el) => node.addElement(el, this.candidateGivenType[el][0], this.candidateGivenType[el]))

  }

  deleteEvent(idx){
    let score = this.state.score.filter((el) => el.props.idx != idx)
    this.setState({score});
  }

  // componentWillUnmount(){}

  // componentWillReceiveProps(){}
  // shouldComponentUpdate(){}
  // componentWillUpdate(){}
  // componentDidUpdate(){}
addComponent(comp){
    const node = this.refDragComposer.current;
    node.addElement(comp, this.candidateGivenType[comp][0], this.candidateGivenType[comp]);


}

addRow(){
    this.refDragComposer.current.addRow();
}
deleteRow(){
  this.refDragComposer.current.deleteRow();
}
  render() {

    return (
    <div>
        <Container className="container-inline">

            <DragComposer ref={this.refDragComposer}></DragComposer>


            <DropdownButton className="btn-sample" title="+ Add Element">
                {this.elementTypes.map(
                (el) =>
                <Dropdown.Item key={el} onClick={() => this.addComponent(el)}>{el}</Dropdown.Item>)
                }

            </DropdownButton>

            <Button className="btn-success" onClick={this.addRow.bind(this)}> Add row</Button>
            <Button className="btn-danger" onClick={this.deleteRow.bind(this)}> Delete row</Button>

        </Container>


    </div>
    );
  }
}

export default Composer;