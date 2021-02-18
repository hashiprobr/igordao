import React, { Component } from 'react';

class MeanItemSet extends Component {
    render() {
        return [
            <h2 key="h2" className={this.props.alert ? 'sub-alert' : null}>{this.props.title}</h2>,
            <div key="div" className="response">
                {this.props.response}
            </div>,
            <p key="p" className="sub-description">{this.props.description}</p>,
        ];
    }
}

export default MeanItemSet;
