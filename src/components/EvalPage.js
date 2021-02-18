import React, { Component } from 'react';
import EvalItemSet from './EvalItemSet';

class EvalPage extends Component {
    render() {
        return (
            <section>
                <p className="description">
                    Os conceitos desta página são <em>essenciais</em>, ou seja, importam
          para aprovação. São os mesmos conceitos da página de objetivos, mas
          aqui estão agrupados por avaliação.
        </p>
                {this.props.schema.evalsOrder.map((title, index) => {
                    return <EvalItemSet key={index}
                        title={title}
                        type="grade"
                        codes={this.props.schema.goalsOrder.filter(code => {
                            return title in this.props.schema.goals[code].evals;
                        })}
                        report={this.props.report[title]}
                        onChange={this.props.onChange} />;
                })}
            </section>
        );
    }
}

export default EvalPage;
