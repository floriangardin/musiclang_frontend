import React, { Component } from 'react';
import './Composer.css';
import Dropdown from "react-bootstrap/Dropdown";
import {Container, DropdownButton} from "react-bootstrap";
import Element from "./Element";
import Button from "react-bootstrap/Button";


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

  }


  // componentWillMount(){}
  componentDidMount(){


  }

  deleteEvent(idx){
    let score = this.state.score.filter((el) => el.props.idx != idx)
    this.setState({score});
  }
  addComponent(comp){
      let score = this.state.score;
      score.push(<Element key={this.state.maxId} idx={this.state.maxId} type={comp}
                                                        candidates={this.candidateGivenType[comp]}
                                                        value={this.candidateGivenType[comp][0]}
                                                        onDelete={this.deleteEvent.bind(this)}
      />);

      this.setState({score: score, maxId: this.state.maxId + 1})
  }
  // componentWillUnmount(){}

  // componentWillReceiveProps(){}
  // shouldComponentUpdate(){}
  // componentWillUpdate(){}
  // componentDidUpdate(){}

  render() {

    return (
      <div>
          <Container>
                <div className="element-array">
                    {this.state.score.map(e => e)}
                </div>


              <DropdownButton title="+ Add Element">
                  {this.elementTypes.map(
                      (el) =>
                          <Dropdown.Item key={el} onClick={() => this.addComponent(el)}>{el}</Dropdown.Item>)
                  }

              </DropdownButton>
          </Container>


      </div>
    );
  }
}

export default Composer;