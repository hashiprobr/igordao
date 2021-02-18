import React, { Component } from 'react';
import DiagPage from './DiagPage';
import EvalPage from './EvalPage';
import GoalPage from './GoalPage';
import MeanPage from './MeanPage';

import desprog from '../schemas/desprog';

import sheet from '../sheet';

class App extends Component {
    constructor(props) {
        super(props);
        this.schemaMissing = true;
        this.schema = {
            desprog: desprog,
        };
        this.stateMissing = true;
        this.state = {
            error: false,
            index: 0,
            diags: null,
            evals: null,
            diffs: null,
            diagCons: null,
            goalMeds: null,
            goalSits: null,
            goalAll: false,
            cmpMean: null,
            essMean: null,
            finMean: null,
        };
        this.consolidations = {
            feedback: sheet.rubric,
            grade: sheet.merge,
            gradepp: sheet.mergepp,
        };
        this.handleFileReaderLoad = this.handleFileReaderLoad.bind(this);
        this.handleFileInputChange = this.handleFileInputChange.bind(this);
        this.handleDiagPageChange = this.handleDiagPageChange.bind(this);
        this.handleEvalPageChange = this.handleEvalPageChange.bind(this);
        this.handleGoalPageChange = this.handleGoalPageChange.bind(this);
        this.handleHeaderNavLiClick = this.handleHeaderNavLiClick.bind(this);
    }

    isValid(report) {
        if (!report || !('Diagnósticos' in report) || !('Avaliações' in report) || !('Deltas' in report)) {
            return false;
        }
        let title, code;
        for (title of this.schema.diagsOrder) {
            if (!(title in report['Diagnósticos'])) {
                return false;
            }
            for (code of this.schema.diags[title].codes) {
                if (!(code in report['Diagnósticos'][title])) {
                    return false;
                }
            }
        }
        for (code of this.schema.goalsOrder) {
            for (title of Object.keys(this.schema.goals[code].evals)) {
                if (!(title in report['Avaliações']) || !(code in report['Avaliações'][title])) {
                    return false;
                }
            }
            if (!(code in report['Deltas'])) {
                return false;
            }
        }
        return true;
    }

    consolidateDiags(schema, report) {
        let values = [];
        for (let code of Object.keys(report)) {
            let value = report[code];
            if (value.substr(-1) === '?') {
                value = value.substr(0, value.length - 1);
            }
            values.push(value);
        }
        return this.consolidations[schema.type](values);
    }

    consolidateEvals(code, schema, report) {
        let grades = [];
        for (let title of Object.keys(schema[code].evals)) {
            let grade = report[title][code];
            if (grade.substr(-1) === '?') {
                grade = grade.substr(0, grade.length - 1);
            }
            grades.push(grade);
        }
        return sheet.goalMedian(grades);
    }

    evaluateGoal(median, diff) {
        if (diff.substr(-1) === '?') {
            diff = diff.substr(0, diff.length - 1);
        }
        return median >= 4.5 || diff === 'S';
    }

    evaluateGoals(goalSits) {
        return !Object.values(goalSits).includes(false);
    }

    calculateCmpMean(schema, diagCons) {
        let weights = [];
        let grades = [];
        for (let title of Object.keys(schema)) {
            weights.push(schema[title].weight);
            grades.push(diagCons[title]);
        }
        return sheet.weightedMean(weights, grades);
    }

    calculateEssMean(schema, report) {
        let weights = [];
        let grades = [];
        for (let code of Object.keys(schema)) {
            for (let title of Object.keys(schema[code].evals)) {
                weights.push(schema[code].evals[title]);
                let grade = report[title][code];
                if (grade.substr(-1) === '?') {
                    grade = grade.substr(0, grade.length - 1);
                }
                grades.push(grade);
            }
        }
        return sheet.weightedMean(weights, grades);
    }

    calculateFinMean(goalAll, cmpMean, essMean) {
        if (goalAll) {
            if (essMean >= 5) {
                return Math.min(10, sheet.round(essMean + 0.1 * cmpMean));
            }
            return essMean;
        }
        return Math.min(4, essMean);
    }

    handleFileReaderLoad(event) {
        let report;
        try {
            report = JSON.parse(event.target.result);
        } catch (error) {
            report = null;
        }
        if (!this.isValid(report)) {
            this.handleFileReaderError(event);
            return;
        }
        this.stateMissing = false;

        let diags = report['Diagnósticos'];

        let diagCons = {};
        for (let title of Object.keys(diags)) {
            diagCons[title] = this.consolidateDiags(this.schema.diags[title], diags[title]);
        }

        let evals = report['Avaliações'];
        let diffs = report['Deltas'];

        let goalMeds = {};
        let goalSits = {};
        for (let code of Object.keys(this.schema.goals)) {
            goalMeds[code] = this.consolidateEvals(code, this.schema.goals, evals);
            goalSits[code] = this.evaluateGoal(goalMeds[code], diffs[code]);
        }

        let goalAll = this.evaluateGoals(goalSits);
        let cmpMean = this.calculateCmpMean(this.schema.diags, diagCons);
        let essMean = this.calculateEssMean(this.schema.goals, evals);
        let finMean = this.calculateFinMean(goalAll, cmpMean, essMean);

        this.setState({
            diags: diags,
            evals: evals,
            diffs: diffs,
            diagCons: diagCons,
            goalMeds: goalMeds,
            goalSits: goalSits,
            goalAll: goalAll,
            cmpMean: cmpMean,
            essMean: essMean,
            finMean: finMean,
        });
    }

    handleFileReaderError(event) {
        this.setState({
            error: true,
        });
    }

    handleFileInputChange(event) {
        let files = event.target.files;
        if (files.length) {
            let reader = new FileReader();
            reader.onload = this.handleFileReaderLoad;
            reader.onerror = this.handleFileReaderError;
            reader.readAsText(files[0]);
        }
    }

    handleDiagPageChange(title, code, value) {
        let diags = this.state.diags;
        diags[title][code] = value;

        let diagCons = this.state.diagCons;
        diagCons[title] = this.consolidateDiags(this.schema.diags[title], diags[title]);

        let cmpMean = this.calculateCmpMean(this.schema.diags, diagCons);
        let finMean = this.calculateFinMean(this.state.goalAll, cmpMean, this.state.essMean);

        this.setState({
            diags: diags,
            diagCons: diagCons,
            cmpMean: cmpMean,
            finMean: finMean,
        });
    }

    handleEvalPageChange(title, code, value) {
        let evals = this.state.evals;
        evals[title][code] = value;

        let goalMeds = this.state.goalMeds;
        let goalSits = this.state.goalSits;
        goalMeds[code] = this.consolidateEvals(code, this.schema.goals, evals);
        goalSits[code] = this.evaluateGoal(goalMeds[code], this.state.diffs[code]);

        let goalAll = this.evaluateGoals(goalSits);
        let essMean = this.calculateEssMean(this.schema.goals, evals);
        let finMean = this.calculateFinMean(goalAll, this.state.cmpMean, essMean);

        this.setState({
            evals: evals,
            goalMeds: goalMeds,
            goalSits: goalSits,
            goalAll: goalAll,
            essMean: essMean,
            finMean: finMean,
        });
    }

    handleGoalPageChange(code, diff) {
        let diffs = this.state.diffs;
        diffs[code] = diff;

        let goalSits = this.state.goalSits;
        goalSits[code] = this.evaluateGoal(this.state.goalMeds[code], diffs[code]);

        let goalAll = this.evaluateGoals(goalSits);
        let finMean = this.calculateFinMean(goalAll, this.state.cmpMean, this.state.essMean);

        this.setState({
            diffs: diffs,
            goalSits: goalSits,
            goalAll: goalAll,
            finMean: finMean,
        });
    }

    handleHeaderNavLiClick(event) {
        let index = parseInt(event.target.getAttribute('data-index'));
        this.setState({
            index: index,
        });
    }

    render() {
        if (this.schemaMissing) {
            let url = new URL(window.location.href);
            let key = url.searchParams.get('schema');
            if (!(key in this.schema)) {
                return (
                    <form>
                        <p>pare de brincar com o endereço da página</p>
                    </form>
                );
            }
            this.schemaMissing = false;
            this.schema = this.schema[key];
        }

        if (this.stateMissing) {
            return (
                <form>
                    <p>carregue abaixo o relatório recebido por email</p>
                    <input type="file" onChange={this.handleFileInputChange} />
                    <p className={this.state.error ? 'error' : 'hidden'}>não foi possível ler o arquivo</p>
                </form>
            );
        }

        let meanLow = this.state.essMean < 5;

        let names = [
            'Diagnósticos',
            'Avaliações',
            'Objetivos',
            'Médias',
        ];

        let pages = [
            <DiagPage schema={this.schema}
                report={this.state.diags}
                result={this.state.diagCons}
                onChange={this.handleDiagPageChange} />,
            <EvalPage schema={this.schema}
                report={this.state.evals}
                onChange={this.handleEvalPageChange} />,
            <GoalPage schema={this.schema}
                report={this.state}
                onDiffChange={this.handleGoalPageChange}
                onEvalChange={this.handleEvalPageChange} />,
            <MeanPage diagCons={this.state.diagCons}
                goalSits={this.state.goalSits}
                cmpMean={this.state.cmpMean}
                essMean={this.state.essMean}
                finMean={this.state.finMean}
                goalAll={this.state.goalAll}
                meanLow={meanLow} />,
        ];

        return [
            <header key="header">
                <nav>
                    <ul>
                        {names.map((name, index) => {
                            let classNames = [];
                            if (index === this.state.index) {
                                classNames.push('current');
                            }
                            if (name === 'Objetivos' && !this.state.goalAll) {
                                classNames.push('alert');
                            }
                            if (name === 'Médias' && (!this.state.goalAll || meanLow)) {
                                classNames.push('alert');
                            }
                            return (
                                <li key={index}
                                    className={classNames ? classNames.join('-') : null}
                                    data-index={index}
                                    onClick={this.handleHeaderNavLiClick}>
                                    {name}
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </header>,
            <main key="main">
                {pages[this.state.index]}
            </main>,
        ];
    }
}

export default App;
