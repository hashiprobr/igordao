import React, { Component } from 'react';
import GoalItemSet from './GoalItemSet';

class GoalPage extends Component {
    render() {
        return [
            <p key="p">
                Os conceitos desta página são <em>essenciais</em>, ou
                seja, importam para aprovação. São os mesmos conceitos da
                página de avaliações, mas aqui estão agrupados por
                objetivo. Se algum título desta página estiver vermelho,
                você ainda não atingiu o objetivo.
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
