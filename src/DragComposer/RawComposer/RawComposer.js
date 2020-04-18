import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Player from "../../Player";
import Element from "../../Composer/Element";

// fake data generator
const getItems = count =>
    Array.from({ length: count }, (v, k) => k).map(k => ({
        idx: k,
        id: `item-${k}`,
        content: `item ${k}`,
        color: 'primary'
    }));



// a little function to help us with reordering the result
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

class RawComposer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            items: [],
            maxId: 0
        };
        this.onChangeValue = this.onChangeValue.bind(this);
    }


    addElement(type, value, candidates){
        let items = this.state.items;
        let newId;
        if(items.length == 0){
            newId = 0;
        }else{
            let ids = items.map((el) => el.idx);
            newId = Math.max(...ids) + 1;
        }
        items.push({
            idx: newId,
            id: `item-${newId}`,
            type: type,
            value: value,
            candidates: candidates,
        });
        this.setState({items})
    }


    onChangeValue(index, value){
      console.log(this.state.items[index].value);
      let items = JSON.parse(JSON.stringify(this.state.items));
      items[index].value = value;
      console.log(items[index].value);
      this.setState({items: items});
    }
    // Normally you would want to split things out into separate components.
    // But in this example everything is just done in one place for simplicity
    render() {
        return (
                <Droppable droppableId={this.props.idRaw} direction="horizontal">
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            style={getListStyle(snapshot.isDraggingOver)}
                            {...provided.droppableProps}
                        >
                            {this.state.items.map((item, index) => (
                                <Draggable key={item.id} draggableId={item.id} index={index}>
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
                                                index={index}
                                                onChangeValue={this.onChangeValue}
                                            />
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
        );
    }
}

export default RawComposer;