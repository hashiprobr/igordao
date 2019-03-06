import React, { Component } from 'react';

class MeanItemSet extends Component {
  render() {
    return [
      <h2 key="h2" className={this.props.alert ? 'sub-alert' : null}>{this.props.title}</h2>,
      <div key="div" className="response">
        {this.props.response}
      </div>,
    ];
  }
}

export default MeanItemSet;
