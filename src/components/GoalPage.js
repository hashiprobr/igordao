import React, { Component } from 'react';
import GoalItemSet from './GoalItemSet';

class GoalPage extends Component {
    render() {
        return [
            <p key="p0">
                Os conceitos desta página são <em>essenciais</em>, ou
                seja, importam para aprovação. São os mesmos conceitos da
                página de avaliações, mas aqui estão agrupados por
                objetivo. Se algum título desta página estiver vermelho,
                você ainda não atingiu o objetivo.
            </p>,
            <p key="p1">
                Os conceitos em branco são aqueles que ainda não estão
                disponíveis, ou seja, a avaliação ainda não foi passada ou
                ainda não foi corrigida. Nesse caso, você pode inserir o
                conceito que quiser para simular possíveis situações.
            </p>,
            <p key="p2">
                As <em>checkboxes</em> representam deltas que ainda não foram
                passadas ou ainda não foram feitas. Você pode pode clicar em
                uma para simular a situação em que você fez a delta e foi bem
                nela.
            </p>,
            this.props.schema.goals.map((g, index) => {
                return (
                    <GoalItemSet
                        key={index}
                        g={g}
                        evals={this.props.schema.evals}
                        eGrades={this.props.report['Avaliações']}
                        delta={this.props.report['Deltas'][g.code]}
                        gMedian={this.props.gMedians[g.code]}
                        gResult={this.props.gResults[g.code]}
                        onEvalChange={this.props.onEvalChange}
                        onGoalChange={this.props.onGoalChange}
                    />
                );
            }),
        ];
    }
}

export default GoalPage;
