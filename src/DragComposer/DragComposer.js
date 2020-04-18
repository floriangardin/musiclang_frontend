import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Player from "../Player";
import Element from "../Composer/Element";
import RawComposer from "./RawComposer";

const zip = (...arrays) => {
  return arrays[0].map(function(_,i){
    return arrays.map(function(array){return array[i]})
  });
}

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};


class DragComposer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
        maxId: 0,
      refsDroppable: [React.createRef()],
      indexDroppables: [0]
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  async addRow(){
    let refs = this.state.refsDroppable.slice();
    let indexes= this.state.indexDroppables.slice();
    refs.push(React.createRef());
    indexes.push(Math.max(...indexes) + 1);
    this.setState({refsDroppable: refs, indexDroppables: indexes});
  }
  deleteRow(){
    let refs = this.state.refsDroppable.slice();
    let indexes= this.state.indexDroppables.slice();
    refs.pop()
    indexes.pop();
    this.setState({refsDroppable: refs, indexDroppables: indexes});
  }

  addElement(type, value, candidates){
    let [droppableArray] = this.state.refsDroppable.slice(-1);
    let droppable = droppableArray.current
    let items = droppable.state.items;
    let newId;
    if(items.length === 0){
        newId = 0;
    }else{
        let ids = items.map((el) => el.idx);
        newId = Math.max(...ids) + 1;
    }
    let len = this.state.refsDroppable.length;
    items.push({
        idx: newId,
        id: `item-${newId}-${len}`,
        type: type,
        value: value,
        candidates: candidates,
        content: value,
    });
    droppable.setState({items})
  }

  onDragEnd(result) {
    // dropped outside the list
    let droppableId = parseInt(result.source.droppableId.replace("droppable", ""));
    let index = this.state.indexDroppables.indexOf(droppableId);
    let droppableArray = this.state.refsDroppable[index];
    let droppable = droppableArray.current;
    if (!result.destination) {
        let items = droppable.state.items;
        items.splice(result.source.index, 1);
        droppable.setState({items})
        return;
    }

    let droppableIdResult = parseInt(result.destination.droppableId.replace("droppable", ""));
    let indexResult = this.state.indexDroppables.indexOf(droppableIdResult);
    let droppableArrayResult = this.state.refsDroppable[indexResult];
    let droppableResult = droppableArrayResult.current;
    if(droppableIdResult === droppableId){

      const items = reorder(
        droppable.state.items,
        result.source.index,
        result.destination.index
      );

      droppable.setState({
        items,
      });
    }else{

      let items = droppable.state.items.slice();
      let newItem = items.splice(result.source.index, 1);
      droppable.setState({items});
      console.log(newItem[0]);
      droppableResult.addElement(newItem[0].type, newItem[0].value, newItem[0].candidates.slice());

      const itemsResult = reorder(
        droppableResult.state.items,
        droppableResult.state.items.length - 1,
        result.destination.index
      );
      console.log(result.source.index);
      console.log(result.destination.index);
      console.log(itemsResult);

      droppableResult.setState({
        items: itemsResult,
      });

    }

  }

  returnDroppables(){
    let result = [];
    let idx = 0;
    for (const [index, ref] of zip(this.state.indexDroppables, this.state.refsDroppable)) {
      result.push(<RawComposer key={idx} ref={ref} idRaw={"droppable"+index}></RawComposer>)
      idx++;
    }
    return result;
  }

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
    return (
        <DragDropContext onDragEnd={this.onDragEnd}>
          {this.returnDroppables().map(e => e)}
        </DragDropContext>
    );
  }
}

export default DragComposer;