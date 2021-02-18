import React, { Component } from 'react';
import Item from './Item';

class DiagItemSet extends Component {
    constructor(props) {
        super(props);
        this.handleItemChange = this.handleItemChange.bind(this);
    }

    handleItemChange(code, value) {
        this.props.onChange(this.props.title, code, value);
    }

    render() {
        return [
            <h2 key="h2">{this.props.title}</h2>,
            <div key="div" className="item-set">
                {this.props.codes.map((code, index) => {
                    return [
                        <p key={'p' + index}>{code}</p>,
                        <Item key={'Item' + index}
                            code={code}
                            type={this.props.type}
                            value={this.props.report[code]}
                            onChange={this.handleItemChange} />,
                    ];
                })}
                <p className="highlight">Consolidação</p><span>{this.props.result}</span>
            </div>,
        ];
    }
}

export default DiagItemSet;
