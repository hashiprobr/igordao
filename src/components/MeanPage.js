import React, { Component } from 'react';
import MeanItemSet from './MeanItemSet';

class MeanPage extends Component {
    render() {
        let achieved = 0;
        let results = Object.values(this.props.gResults);
        for (let result of results) {
            if (result) {
                achieved++;
            }
        }

        return [
            <p key="p">
                Se algum título desta página estiver vermelho, você ainda
                não está aprovado na disciplina.
            </p>,
            <MeanItemSet
                key="eval"
                failed={this.props.low}
                name="Média dos Conceitos Essenciais"
                content={this.props.eMean}
                description="Uma média essencial abaixo de 5 limita a média final a 4."
            />,
            <MeanItemSet
                key="goal"
                failed={this.props.failed}
                name="Objetivos Atingidos"
                content={achieved + '/' + results.length}
                description="Um objetivo que não foi atingido limita a média final a 4."
            />,
            <MeanItemSet
                key="diag"
                failed={false}
                name="Média dos Conceitos Complementares"
                content={this.props.cMean}
                description="Se algum título estiver vermelho, essa média complementar é ignorada."
            />,
            <MeanItemSet
                key="show"
                failed={false}
                name="Nota Final"
                content={this.props.fGrade}
                description="Se nenhum título estiver vermelho, 100% da essencial mais 10% da complementar."
            />,
        ];
    }
}

export default MeanPage;
