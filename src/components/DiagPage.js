import React, { Component } from 'react';
import DiagItemSet from './DiagItemSet';

class DiagPage extends Component {
    render() {
        return [
            <p key="p">
                Os conceitos desta página são <em>complementares</em>, ou
                seja, não importam para aprovação. Você pode ser aprovado
                mesmo se forem baixos e pode ser reprovado mesmo se forem
                altos.
            </p>,
            <DiagItemSet
                key={"DiagItemSet"}
                diags={this.props.schema.diags}
                dGrades={this.props.report['Diagnósticos']}
                onChange={this.props.onChange}
            />,
        ];
    }
}

export default DiagPage;
