import React, { Component } from 'react';
import GoalItemSet from './GoalItemSet';

class GoalPage extends Component {
  render() {
    return (
      <section>
        {this.props.schema.goalsOrder.map((code, index) => {
          let titles = this.props.schema.evalsOrder.filter(title => {
            return title in this.props.schema.goals[code].evals;
          });
          let report = {};
          for (let title of titles) {
            report[title] = this.props.report.evals[title][code];
          }
          return <GoalItemSet key={index}
                              code={code}
                              title={code + ': ' + this.props.schema.goals[code].title}
                              type="grade"
                              codes={titles}
                              report={report}
                              result={this.props.report.goalMeds[code]}
                              diff={this.props.report.diffs[code]}
                              response={this.props.report.goalSits[code]}
                              onDiffChange={this.props.onDiffChange}
                              onEvalChange={this.props.onEvalChange}/>;
        })}
      </section>
    );
  }
}

export default GoalPage;
