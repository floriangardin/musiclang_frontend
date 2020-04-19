import React, { Component } from 'react';
import './Element.css';
import {DropdownButton} from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";


class Element extends Component {
    constructor(props){
        super(props);
        this.onChangeValue = props.onChangeValue;
    }

    getClassWithType(){
        switch (this.props.type) {
            case "mode":
                return "primary";
            case "note":
                return "danger";
            case "style":
                return "success";
            case "chord":
                return "default";
            case "duration":
                return "secondary";
            default:
                return "primary";

        }
    }

    renderSimple(){
        return (
            <div className="element-simple">
                <DropdownButton className="dropdown-button" variant={this.getClassWithType()} title={this.props.value}>
                    {this.props.candidates.map(
                        (el) =>
                            <Dropdown.Item className="flexnav" key={el}
                                           onClick={() => this.onChangeValue(this.props.rowIndex, this.props.columnIndex, el)}>{el}</Dropdown.Item>)
                    }

                </DropdownButton>


            </div>
        );
    }

  render(){
    return this.renderSimple();
  }
}

export default Element;