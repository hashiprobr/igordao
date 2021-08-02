import React, { Component } from 'react';

class Item extends Component {
    constructor(props) {
        super(props);
        this.grades = ['I', 'D', 'C', 'C+', 'B', 'B+', 'A', 'A+'];
        this.handleSelectChange = this.handleSelectChange.bind(this);
    }

    handleSelectChange(event) {
        let grade = event.target.selectedOptions[0].text;
        this.props.onChange(this.props.id, grade + '?');
    }

    getClassName(grade) {
        if (grade === 'I') {
            return 'insufficient';
        }
        if (grade === 'D') {
            return 'developing';
        }
        if (grade === 'C' || grade === 'C+') {
            return 'essential';
        }
        if (grade === 'B' || grade === 'B+') {
            return 'proficient';
        }
        return 'advanced';
    }

    render() {
        if (this.grades.includes(this.props.grade)) {
            let space;
            if (this.props.grade.endsWith('+')) {
                space = '';
            } else {
                space = <>&nbsp;</>;
            }
            return (
                <span className={'item ' + this.getClassName(this.props.grade)}>
                    {this.props.grade}{space}
                </span>
            );
        }

        let selected = this.props.grade;
        if (selected.endsWith('?')) {
            selected = selected.slice(0, -1);
        }
        if (!this.grades.includes(selected)) {
            selected = 'I';
        }

        return (
            <select className="item"
                defaultValue={selected}
                onChange={this.handleSelectChange}
            >
                {this.grades.map((grade, index) => {
                    return (
                        <option
                            key={index}
                            className={this.getClassName(grade)}
                        >
                            {grade}
                        </option>
                    );
                })}
            </select>
        );
    }
}

export default Item;
