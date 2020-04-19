import React, { Component } from 'react';
import './ContextMenu.scss';

class ContextMenu extends Component {

  constructor(props){
    super(props);

  }

  onClickWrapper(e, callback){
    callback();
    this.props.onClick(e);
  }
  render(){

    const clickX = this.props.x
    const clickY = this.props.y;
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;
    const rootW = 0;
    const rootH = 0;
    const right = (screenW - clickX) > rootW;
    const left = !right;
    const top = (screenH - clickY) > rootH;
    const bottom = !top;
    const style = {}
    if (right) {
      style.left = `${clickX + 5}px`;
    }

    if (left) {
      style.left = `${clickX - rootW - 5}px`;
    }

    if (top) {
      style.top = `${clickY + 5}px`;
    }

    if (bottom) {
      style.top = `${clickY - rootH - 5}px`;
    }
    style.overflow = 'inherit';

    if(!this.props.visible){
      return <div></div>
    }
    return <div className="contextMenu" ref={ref => {this.root = ref}} style={style} className="contextMenu">
      {this.props.addItems.map(e => <div key={e.text+ "1"} className="contextMenu--option"
                                         onClick={(event) =>
                                           this.onClickWrapper(event, e.callback)}>{e.text}</div>)}
      <div className="contextMenu--separator" />
      {this.props.deleteItems.map(e => <div key={e.text+ "2"}
                                            className="contextMenu--option"
                                            onClick={(event) =>
                                              this.onClickWrapper(event, e.callback)}>{e.text}</div>)}

    </div>
  };

}

export default ContextMenu;