import React, { Component } from 'react';
import Item from './Item';

class DiagItemSet extends Component {
    render() {
        return (
            <div className="item-set">
                {this.props.diags.map((d, index) => {
                    return [
                        <span
                            key={'span' + index}>
                            {d.name} <em>(peso {d.weight})</em>
                        </span>,
                        <Item
                            key={'Item' + index}
                            id={d.name}
                            grade={this.props.dGrades[d.name]}
                            onChange={this.props.onChange}
                        />,
                    ];
                })}
            </div>
        );
    }
}

export default DiagItemSet;
