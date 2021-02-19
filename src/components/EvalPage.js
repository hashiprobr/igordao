import React, { Component } from 'react';
import EvalItemSet from './EvalItemSet';

class EvalPage extends Component {
    render() {
        return [
            <p key="p">
                Os conceitos desta página são <em>essenciais</em>, ou
                seja, importam para aprovação. São os mesmos conceitos da
                página de objetivos, mas aqui estão agrupados por
                avaliação.
            </p>,
            this.props.schema.evals.map((eName, index) => {
                return (
                    <EvalItemSet
                        key={index}
                        eName={eName}
                        grades={this.props.report['Avaliações'][eName]}
                        reverse={this.props.reverse[eName]}
                        onChange={this.props.onChange}
                    />
                );
            }),
        ];
    }
}

export default EvalPage;
