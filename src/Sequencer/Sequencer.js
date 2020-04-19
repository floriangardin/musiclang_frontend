import React, { Component } from 'react';
import './Sequencer.css';
import Dropdown from "react-bootstrap/Dropdown";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import Element from "../Element";
import Button from "react-bootstrap/Button";
import {Container, DropdownButton} from "react-bootstrap";

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
  overflow: 'visible',
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
      'double whole', 'whole'
    ]
    this.elementTypes = ["mode", "note", "style", "chord", "duration"];
    this.candidateGivenType = {"mode": this.modeCandidates, "note": this.noteCandidates,
      "style": this.styleCandidates, "chord": this.chordCandidates, "duration": this.durationCandidates};
    this.state = {rows: [
        [
          {'type': 'note', 'value': 'C', 'candidates': this.candidateGivenType['note']},
          {'type': 'note', 'value': 'D', 'candidates': this.candidateGivenType['note']}
        ],
        [
        {'type': 'note', 'value': 'E', 'candidates': this.candidateGivenType['note']},
        {'type': 'note', 'value': 'F', 'candidates': this.candidateGivenType['note']}
      ]

      ]};
    this.renderRows = this.renderRows.bind(this);
    this.renderItems = this.renderItems.bind(this);
    this.onChangeValue = this.onChangeValue.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.addRow = this.addRow.bind(this)
    this.deleteRow = this.deleteRow.bind(this);
    this.addElement = this.addElement.bind(this);
    this.handleClick = this.handleClick.bind(this);
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
    if (e.type === 'click') {
      console.log('Left click', rowIndex);
    } else if (e.type === 'contextmenu') {
      console.log('Right click', rowIndex);
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
  deleteRow(){
    let rows = this.state.rows;
    rows.splice(-1);
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
        <Button className="btn-danger" onClick={this.deleteRow}> Delete row</Button>
      </div>
    );
  }
}

export default Sequencer;