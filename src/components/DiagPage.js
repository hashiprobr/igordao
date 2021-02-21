import React, { Component } from 'react';
import DiagItemSet from './DiagItemSet';

class DiagPage extends Component {
    render() {
        return [
            <p key="p0">
                Os conceitos desta página são <em>complementares</em>, ou
                seja, não importam para aprovação. Você pode ser aprovado
                mesmo se forem baixos e pode ser reprovado mesmo se forem
                altos.
            </p>,
            <p key="p1">
                Os conceitos com setas são aqueles que ainda não estão
                disponíveis, ou seja, o diagnóstico ainda não foi passado ou
                ainda não foi corrigido. Nesse caso, você pode inserir o
                conceito que quiser para simular possíveis situações.
            </p>,
            <hr key="hr"/>,
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
