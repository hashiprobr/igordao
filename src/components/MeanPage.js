import React, { Component } from 'react';
import MeanItemSet from './MeanItemSet';

class MeanPage extends Component {
  render() {
    let reached = 0;
    for (let code of Object.keys(this.props.goalSits)) {
      if (this.props.goalSits[code]) {
        reached++;
      }
    }
    return (
      <section>
        <p className="description">
          Se algum título desta página estiver vermelho, você ainda não está aprovado
          na disciplina.
        </p>
        <MeanItemSet title="Objetivos Atingidos"
                     response={reached + '/' + Object.keys(this.props.goalSits).length}
                     alert={!this.props.goalAll}
                     description="Um objetivo que não foi atingido limita a média final a 4."/>
        <MeanItemSet title="Média dos Conceitos Essenciais"
                     response={this.props.essMean}
                     alert={this.props.meanLow}
                     description="Uma média essencial abaixo de 5 limita a média final ao mesmo valor."/>
        <MeanItemSet title="Média dos Conceitos Complementares"
                     response={this.props.cmpMean}
                     description="Se algum título estiver vermelho, essa média complementar é ignorada."/>
        <MeanItemSet title="Média Final"
                     response={this.props.finMean}
                     description="Se nenhum título estiver vermelho, 100% da essencial mais 10% da complementar."/>
      </section>
    );
  }
}

export default MeanPage;
