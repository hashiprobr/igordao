import React, { Component } from 'react';

class MeanItemSet extends Component {
    render() {
        return [
            <h2 key="h2" className={this.props.failed ? 'alert' : null}>
                {this.props.name}
            </h2>,
            <p key="p" className="description">
                {this.props.description}
            </p>,
            <p key="div" className="grade">
                {this.props.content}
            </p>,
        ];
    }
}

export default MeanItemSet;
