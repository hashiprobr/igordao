import React, { Component } from 'react';
import Item from './Item';

class GoalItemSet extends Component {
    constructor(props) {
        super(props);
        this.handleCheckboxInputChange = this.handleCheckboxInputChange.bind(this);
        this.handleItemChange = this.handleItemChange.bind(this);
    }

    handleCheckboxInputChange(event) {
        this.props.onDiffChange(this.props.code, event.target.checked ? 'S?' : 'N?');
    }

    handleItemChange(code, value) {
        this.props.onEvalChange(code, this.props.code, value);
    }

    render() {
        let diff;
        switch (this.props.diff) {
            case 'N':
                diff = <span>☐</span>;
                break;
            case 'S':
                diff = <span>☑</span>;
                break;
            default:
                let checked;
                if (this.props.diff.substr(-1) === '?') {
                    checked = this.props.diff.substr(0, this.props.diff.length - 1);
                }
                diff = <input type="checkbox"
                    defaultChecked={checked === 'S'}
                    onChange={this.handleCheckboxInputChange} />;
        }

        return [
            <h2 key="h2" className={this.props.response ? null : 'sub-alert'}>{this.props.title}</h2>,
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
                <p className="highlight">Mediana</p><span>{this.props.result}</span>
                <p className="highlight">Fez delta e passou</p>{diff}
            </div>,
        ];
    }
}

export default GoalItemSet;
