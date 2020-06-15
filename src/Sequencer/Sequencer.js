import React, { Component } from 'react';
import './Sequencer.scss';
import Dropdown from "react-bootstrap/Dropdown";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import Element from "../Element";
import Button from "react-bootstrap/Button";
import {Container, DropdownButton} from "react-bootstrap";
import ContextMenu from "../ContextMenu/ContextMenu";
import Player from "../Player";

const zip = (...arrays) => {
  return arrays[0].map(function(_,i){
    return arrays.map(function(array){return array[i]})
  });
}

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;
const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 ${grid}px 0 0`,

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'grey',

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  display: 'flex',
  padding: grid,
});



class Sequencer extends Component {
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
      'quarter', 'eight'
    ]
    this.elementTypes = ["mode", "note", "style", "chord", "duration"];
    this.candidateGivenType = {"mode": this.modeCandidates, "note": this.noteCandidates,
      "style": this.styleCandidates, "chord": this.chordCandidates, "duration": this.durationCandidates};
    this.state = {rows: [
        [
          {'type': 'mode', 'value': 'Major', 'candidates': this.candidateGivenType['mode']},
          {'type': 'note', 'value': 'C', 'candidates': this.candidateGivenType['note']},
          {'type': 'style', 'value': 'Chopin', 'candidates': this.candidateGivenType['style']},
          {'type': 'chord', 'value': 'i', 'candidates': this.candidateGivenType['chord']},
          {'type': 'chord', 'value': 'iii', 'candidates': this.candidateGivenType['chord']},
          {'type': 'chord', 'value': 'v', 'candidates': this.candidateGivenType['chord']},
          {'type': 'duration', 'value': 'quarter', 'candidates': this.candidateGivenType['duration']}
        ],
        [
          {'type': 'chord', 'value': 'vi', 'candidates': this.candidateGivenType['chord']},
          {'type': 'chord', 'value': 'i', 'candidates': this.candidateGivenType['chord']},
          {'type': 'chord', 'value': 'iii', 'candidates': this.candidateGivenType['chord']},
          {'type': 'duration', 'value': 'quarter', 'candidates': this.candidateGivenType['duration']}
      ]

      ], contextVisible: false, selectedRow: 0, x: 0, y: 1,
    score: {
      midi_to_play: [{pitch: 60, duration: 2.5, offset:1, track: 1, volume:100},
        {pitch: 64, duration: 2.5, offset:2, track: 1, volume: 70},
        {pitch: 67, duration: 2.5, offset:3, track: 1, volume: 20},
        {pitch: 67, duration: 2.5, offset:4, track: 1, volume: 10}
      ],
      instruments: {0: 3, 1:3 },
      tempo: 120},
    loading: false
    };


    this.renderRows = this.renderRows.bind(this);
    this.renderItems = this.renderItems.bind(this);
    this.onChangeValue = this.onChangeValue.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.addRow = this.addRow.bind(this)
    this.deleteRow = this.deleteRow.bind(this);
    this.addElement = this.addElement.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.addRowAt = this.addRowAt.bind(this);
    this.loadScoreFromBackend = this.loadScoreFromBackend.bind(this);
  }


  loadScoreFromBackend(){
    this.setState({loading: true});
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score: this.state.rows})
    };
    fetch("http://localhost:5000/post", requestOptions)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({score:{
            instruments: result.instruments,
            tempo: result.tempo,
            midi_to_play: result.score},
            loading: false
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            loading: false,
            error
          });
        }
      )
  }


  onChangeValue(rowIndex, columnIndex, value){
    let rows = this.state.rows;
    rows[rowIndex][columnIndex].value = value;
    this.setState({rows});
  }

  renderItems(rowIndex){
    let resultItem = []
    for (const [columnIndex, item] of this.state.rows[rowIndex].entries()) {
        resultItem.push(
          <Draggable key={rowIndex + "-" + columnIndex} draggableId={rowIndex + "-" + columnIndex} index={columnIndex}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                style={getItemStyle(
                  snapshot.isDragging,
                  provided.draggableProps.style
                )}
              >
                <Element
                  idx={item.idx} type={item.type}
                  candidates={item.candidates}
                  value={item.value}
                  rowIndex={rowIndex}
                  columnIndex={columnIndex}
                  onChangeValue={this.onChangeValue}
                />
              </div>
            )}
          </Draggable>
        );
    }
    return resultItem;
  }

  handleClick(e, rowIndex){
    e.preventDefault();
    this.setState({x: e.clientX, y: e.clientY});
    if (e.type === 'click') {
      this.setState({contextVisible: false, selectedRow: rowIndex});
    } else if (e.type === 'contextmenu') {
      this.setState({contextVisible: true, selectedRow: rowIndex});
    }
  }

  renderRows(){
    let resultRows = []
    for (const [rowIndex, element] of this.state.rows.entries()) {
      resultRows.push(
        <div key={rowIndex} onClick={(e) => this.handleClick(e, rowIndex)}
             onContextMenu={(e) => this.handleClick(e, rowIndex)}>
          <Droppable droppableId={String(rowIndex)}  direction="horizontal">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              className="row-sequencer"
              style={getListStyle(snapshot.isDraggingOver)}
              {...provided.droppableProps}
            >
              {this.renderItems(rowIndex)}
              {provided.placeholder}
            </div>)}
          </Droppable>
        </div>)
    }

    return resultRows;
  }

  addRow(){
    let rows = this.state.rows;
    rows.push([]);
    this.setState({rows});
  }
  addRowAt(index){
    let rowsBefore = this.state.rows.slice(0, index + 1);
    let rowsAfter = this.state.rows.slice(index + 1, this.state.rows.length);
    rowsBefore.push([]);
    let rows = rowsBefore.concat(rowsAfter);
    this.setState({rows});
  }
  deleteRow(index){
    let rows = this.state.rows;
    rows.splice(index, 1);
    this.setState({rows});
  }
  addElement(el, rowIndex){
    let rows = this.state.rows;
    if(rowIndex == -1){
      this.addRow();
    }
    rows[rowIndex].push({'type': el,
      'value': this.candidateGivenType[el][0],
      'candidates': this.candidateGivenType[el]})

    this.setState({rows});
  }

  onDragEnd(result){
    let rowSource = parseInt(result.source.droppableId);
    let columnSource = result.source.index;
    let rows = this.state.rows;
    let newElement = rows[rowSource].splice(columnSource, 1);

    if(result.destination){
      let rowDestination = parseInt(result.destination.droppableId);
      let columnDestination = result.destination.index;
      rows[rowDestination].push(newElement[0]);
      const rowDestinationResult = reorder(
        rows[rowDestination],
        rows[rowDestination].length - 1,
        columnDestination
      );
      rows[rowDestination] = rowDestinationResult;
    }
    this.setState({rows});
  }

  getDictContext(el){
    return {callback: (() => this.addElement(el, this.state.selectedRow)), text: "Add " + el};
  }
  render() {
    return (
      <div>
        <DragDropContext onDragEnd={this.onDragEnd}>
          {this.renderRows().map(e => e)}
        </DragDropContext>
        <DropdownButton className="btn-sample" title="+ Add Element">
          {this.elementTypes.map(
            (el) =>
              <Dropdown.Item key={el} onClick={() => this.addElement(el, this.state.rows.length - 1)}>{el}</Dropdown.Item>)
          }
        </DropdownButton>
        <Button className="btn-success" onClick={this.addRow}> Add row</Button>
        <Button className="btn-danger" onClick={() => this.deleteRow(this.state.rows.length - 1)}> Delete row</Button>
        <ContextMenu key="context" onClick={(e) => this.handleClick(e, this.state.selectedRow)}
                     addItems={
          this.elementTypes.map(
            (el) => this.getDictContext(el)
          )
        } deleteItems={[{callback: (() => this.deleteRow(this.state.selectedRow)), text: "Delete row"},
          {callback: (() => this.addRowAt(this.state.selectedRow)), text: "Add row after"}
        ]} visible={this.state.contextVisible} x={this.state.x} y={this.state.y}/>
        <Player score={this.state.score} loading={this.state.loading} loadScoreFromBackend={this.loadScoreFromBackend}></Player>
      </div>
    );
  }
}

export default Sequencer;