import React, { Component } from 'react';
import EvalItemSet from './EvalItemSet';

class EvalPage extends Component {
    render() {
        return [
            <p key="p0">
                Os conceitos desta página são <em>essenciais</em>, ou
                seja, importam para aprovação. São os mesmos conceitos da
                página de objetivos, mas aqui estão agrupados por
                avaliação.
            </p>,
            <p key="p1">
                Os conceitos em cor branca são aqueles que ainda não estão
                disponíveis, ou seja, a avaliação ainda não foi passada ou
                ainda não foi corrigida. Nesse caso, você pode inserir o
                conceito que quiser para simular possíveis situações.
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
