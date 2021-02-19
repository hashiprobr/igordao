import React, { Component } from 'react';
import Item from './Item';

class EvalItemSet extends Component {
    constructor(props) {
        super(props);
        this.handleItemChange = this.handleItemChange.bind(this);
    }

    handleItemChange(gCode, grade) {
        for (let r of this.props.reverse) {
            let g = r.g;
            if (g.code === gCode) {
                this.props.onChange(this.props.eName, g, grade);
                return;
            }
        }
    }

    render() {
        return [
            <h2 key="h2">
                {this.props.eName}
            </h2>,
            <div key="div" className="item-set">
                {this.props.reverse.map((r, index) => {
                    let g = r.g;
                    let eWeight = r.eWeight;
                    return [
                        <span key={'span' + index}>
                            Objetivo {g.code} <em>(peso {eWeight})</em>
                        </span>,
                        <Item
                            key={'Item' + index}
                            id={g.code}
                            grade={this.props.grades[g.code]}
                            onChange={this.handleItemChange}
                        />,
                    ];
                })}
            </div>,
        ];
    }
}

export default EvalItemSet;
