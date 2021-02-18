import React, { Component } from 'react';
import DiagItemSet from './DiagItemSet';

class DiagPage extends Component {
    render() {
        return (
            <section>
                <p className="description">
                    Os conceitos desta página são <em>complementares</em>, ou seja,
          não importam para aprovação. Você pode ser aprovado mesmo se
          forem baixos e pode ser reprovado mesmo se forem altos.
        </p>
                {this.props.schema.diagsOrder.map((title, index) => {
                    return <DiagItemSet key={index}
                        title={title}
                        type={this.props.schema.diags[title].type}
                        codes={this.props.schema.diags[title].codes}
                        report={this.props.report[title]}
                        result={this.props.result[title]}
                        onChange={this.props.onChange} />;
                })}
            </section>
        );
    }
}

export default DiagPage;
