import React, { Component } from 'react';

class Item extends Component {
    constructor(props) {
        super(props);
        this.options = {
            feedback: {
                'N': 'failure',
                'P': 'partial',
                'T': 'success',
            },
            grade: {
                'I': 'failure',
                'D': 'failure',
                'C': 'success',
                'C+': 'success',
                'B': 'success',
                'B+': 'success',
                'A': 'success',
                'A+': 'success',
            },
            gradepp: {
                'I': 'failure',
                'D': 'failure',
                'C': 'success',
                'C+': 'success',
                'B': 'success',
                'B+': 'success',
                'A': 'success',
                'A+': 'success',
            },
        };
        this.handleSelectChange = this.handleSelectChange.bind(this);
    }

    handleSelectChange(event) {
        this.props.onChange(this.props.code, event.target.selectedOptions[0].text + '?');
    }

    render() {
        let options = this.options[this.props.type];

        if (this.props.value in options) {
            return <span className={options[this.props.value]}>{this.props.value}</span>;
        }

        let selected;
        if (this.props.value.substr(-1) === '?') {
            selected = this.props.value.substr(0, this.props.value.length - 1);
        }

        return (
            <select defaultValue={selected}
                onChange={this.handleSelectChange}>
                {Object.keys(options).map((value, index) => {
                    return <option key={index}>{value}</option>;
                })}
            </select>
        );
    }
}

export default Item;
