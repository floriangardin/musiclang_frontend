import React, { Component } from 'react';
import './Element.css';
import {Container, DropdownButton} from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button"
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import MultiSelect from "@khanacademy/react-multi-select";
const REACT_VERSION = React.version;


class Element extends Component {
    constructor(props){
        super(props);
        this.type = props.type;
        this.value = props.value;
        console.log("React version" + REACT_VERSION);
        this.candidates = props.candidates;
        this.isMulti = this.type === "chord";
        if(this.isMulti){
            this.state = {currentValue: [this.candidates[0]]};
        }else{
            this.state = {currentValue: this.candidates[0]};
        }

    }

    handleClick(val){
        this.setState({currentValue: val});
    }

    getClassWithType(){
        switch (this.type) {
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

  // componentWillMount(){}
  // componentDidMount(){}
  // componentWillUnmount(){}

  // componentWillReceiveProps(){}
  // shouldComponentUpdate(){}
  // componentWillUpdate(){}
  // componentDidUpdate(


    renderSimple(){
        return (
            <div className="element-simple">
                <DropdownButton  variant={this.getClassWithType()} title={this.state.currentValue}>
                    {this.candidates.map(
                        (el) =>
                            <Dropdown.Item key={el} onClick={() => this.handleClick(el)}>{el}</Dropdown.Item>)
                    }

                </DropdownButton>
                <Button variant={this.getClassWithType()}
                        onClick={() => this.props.onDelete(this.props.idx)}> X </Button>

            </div>
        );
    }

    renderMulti(){
        return (
            <div>
                <Row>
                    <Col>
                        <MultiSelect
                        options={this.candidates}
                        selected={this.state.currentValue}
                        onSelectedChanged={selected => this.setState({currentValue: selected})}/>
                    </Col>
                    <Col>
                        <select className="custom-select" multiple>
                            <option selected>Open this select menu</option>
                            <option value="1">One</option>
                            <option value="2">Two</option>
                            <option value="3">Three</option>
                        </select>
                    </Col>
                    <Col>
                        <Button variant={this.getClassWithType()}
                                onClick={() => this.props.onDelete(this.props.idx)}> X </Button>
                    </Col>
                </Row>

            </div>
        );
    }
  render() {
    return this.isMulti ? this.renderMulti() : this.renderSimple();
  }
}

export default Element;