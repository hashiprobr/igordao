import React, { Component } from 'react';
import Item from './Item';

class GoalItemSet extends Component {
    constructor(props) {
        super(props);
        this.handleItemChange = this.handleItemChange.bind(this);
        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    }

    handleItemChange(eName, grade) {
        this.props.onEvalChange(eName, this.props.g, grade);
    }

    handleCheckboxChange(event) {
        let delta = event.target.checked ? 'S' : 'N';
        this.props.onGoalChange(this.props.g.code, delta + '?');
    }

    render() {
        let checkbox;
        switch (this.props.delta) {
            case 'N':
                checkbox = (
                    <span className="item">
                        ✗
                    </span>
                );
                break;
            case 'S':
                checkbox = (
                    <span className="item">
                        ✓
                    </span>
                );
                break;
            default:
                let checked = this.props.delta;
                if (checked.endsWith('?')) {
                    checked = checked.slice(0, -1);
                }
                checkbox = (
                    <input
                        type="checkbox"
                        className="item"
                        defaultChecked={checked === 'S'}
                        onChange={this.handleCheckboxChange}
                    />
                );
        }

        return [
            <h2 key="h2" className={this.props.gResult ? null : 'alert'}>
                {this.props.g.code}: {this.props.g.name}
            </h2>,
            <div key="div" className="item-set">
                {this.props.g.evals.map((e, index) => {
                    let eName = this.props.evals[e.index];
                    return [
                        <span key={'span' + index}>
                            {eName}
                        </span>,
                        <Item
                            key={'Item' + index}
                            id={eName}
                            grade={this.props.eGrades[eName][this.props.g.code]}
                            onChange={this.handleItemChange}
                        />,
                    ];
                })}
                <span className="highlight">
                    {this.props.g.maximum ? 'Máximo' : 'Mediana'}
                </span>
                <span className="item">
                    {this.props.gMedian}
                </span>
                <span className="highlight">
                    Fez delta e foi bem
                </span>
                {checkbox}
            </div>,
        ];
    }
}

export default GoalItemSet;
