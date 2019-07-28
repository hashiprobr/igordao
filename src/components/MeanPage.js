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
        <MeanItemSet title="Objetivos Atingidos"
                     response={reached + '/' + Object.keys(this.props.goalSits).length}/>
        <MeanItemSet title="Média Essencial"
                     response={this.props.essMean}
                     alert={this.props.alert}/>
        <MeanItemSet title="Média Complementar"
                     response={this.props.cmpMean}/>
        <MeanItemSet title="Média Final"
                     response={this.props.finMean}/>
      </section>
    );
  }
}

export default MeanPage;
