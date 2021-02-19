import React, { Component } from 'react';
import DiagPage from './DiagPage';
import EvalPage from './EvalPage';
import GoalPage from './GoalPage';
import MeanPage from './MeanPage';
import sheet from '../sheet';

import desprog from '../schemas/desprog';

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
            report: null,
            eMean: null,
            gMedians: null,
            gResults: null,
            failed: null,
            cMean: null,
            fGrade: null,
        };
        this.reverse = {};
        this.handleFileReaderLoad = this.handleFileReaderLoad.bind(this);
        this.handleFileReaderError = this.handleFileReaderError.bind(this);
        this.handleFileInputChange = this.handleFileInputChange.bind(this);
        this.handleDiagPageChange = this.handleDiagPageChange.bind(this);
        this.handleEvalPageChange = this.handleEvalPageChange.bind(this);
        this.handleGoalPageChange = this.handleGoalPageChange.bind(this);
        this.handlePageNameClick = this.handlePageNameClick.bind(this);
    }

    isValid(report) {
        if (!report || typeof report !== 'object') {
            return false;
        }
        let eGrades = report['Avaliações'];
        if (!eGrades || typeof eGrades !== 'object') {
            return false;
        }
        let gDeltas = report['Deltas'];
        if (!gDeltas || typeof gDeltas !== 'object') {
            return false;
        }
        let dGrades = report['Diagnósticos'];
        if (!dGrades || typeof dGrades !== 'object') {
            return false;
        }
        for (let eName of this.schema.evals) {
            let e = eGrades[eName];
            if (!e || typeof e !== 'object') {
                return false;
            }
        }
        for (let g of this.schema.goals) {
            for (let e of g.evals) {
                let eName = this.schema.evals[e.index];
                if (typeof eGrades[eName][g.code] !== 'string') {
                    return false;
                }
            }
            if (typeof gDeltas[g.code] !== 'string') {
                return false;
            }
        }
        for (let d of this.schema.diags) {
            if (typeof dGrades[d.name] !== 'string') {
                return false;
            }
        }
        return true;
    }

    trim(grade) {
        if (grade.endsWith('?')) {
            return grade.slice(0, -1);
        }
        return grade;
    }

    processEvals(report) {
        let weights = [];
        let grades = [];
        let eGrades = report['Avaliações'];
        for (let g of this.schema.goals) {
            for (let e of g.evals) {
                let eName = this.schema.evals[e.index];
                weights.push(e.weight);
                grades.push(this.trim(eGrades[eName][g.code]));
            }
        }
        return sheet.weightedMean(weights, grades);
    }

    processGoalEvals(report, g) {
        let args = [];
        let eGrades = report['Avaliações'];
        for (let e of g.evals) {
            let eName = this.schema.evals[e.index];
            args.push(this.trim(eGrades[eName][g.code]));
        }
        return sheet.goalMedian(args);
    }

    processGoalDiffs(report, gMedians, gCode) {
        let gDeltas = report['Deltas'];
        return sheet.goalResult(gMedians[gCode], this.trim(gDeltas[gCode]));
    }

    processDiags(report) {
        let weights = [];
        let grades = [];
        let dGrades = report['Diagnósticos'];
        for (let d of this.schema.diags) {
            weights.push(d.weight);
            grades.push(this.trim(dGrades[d.name]));
        }
        return sheet.weightedMean(weights, grades);
    }

    handleFileReaderLoad(event) {
        let report;
        try {
            report = JSON.parse(event.target.result);
        } catch (error) {
            report = null;
        }
        if (!this.isValid(report)) {
            this.handleFileReaderError();
            return;
        }
        this.stateMissing = false;

        let eMean = this.processEvals(report);

        let gMedians = {};
        let gResults = {};
        for (let g of this.schema.goals) {
            gMedians[g.code] = this.processGoalEvals(report, g);
            gResults[g.code] = this.processGoalDiffs(report, gMedians, g.code);
        }

        let failed = sheet.processGoals(gResults);

        let cMean = this.processDiags(report);

        let fGrade = sheet.finalGrade(eMean, failed, cMean);

        this.setState({
            report: report,
            eMean: eMean,
            gMedians: gMedians,
            gResults: gResults,
            failed: failed,
            cMean: cMean,
            fGrade: fGrade,
        });

        for (let eName of this.schema.evals) {
            this.reverse[eName] = [];
        }
        for (let g of this.schema.goals) {
            for (let e of g.evals) {
                let eName = this.schema.evals[e.index];
                this.reverse[eName].push({
                    'g': g,
                    'eWeight': e.weight,
                });
            }
        }
    }

    handleFileReaderError() {
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

    handleDiagPageChange(dName, grade) {
        let report = this.state.report;
        report['Diagnósticos'][dName] = grade;

        let cMean = this.processDiags(report);

        let fGrade = sheet.finalGrade(this.state.eMean, this.state.failed, cMean);

        this.setState({
            report: report,
            cMean: cMean,
            fGrade: fGrade,
        });
    }

    handleEvalPageChange(eName, g, grade) {
        let report = this.state.report;
        report['Avaliações'][eName][g.code] = grade;

        let eMean = this.processEvals(report);

        let gMedians = this.state.gMedians;
        let gResults = this.state.gResults;
        gMedians[g.code] = this.processGoalEvals(report, g);
        gResults[g.code] = this.processGoalDiffs(report, gMedians, g.code);

        let failed = sheet.processGoals(gResults);

        let fGrade = sheet.finalGrade(eMean, failed, this.state.cMean);

        this.setState({
            report: report,
            eMean: eMean,
            gMedians: gMedians,
            gResults: gResults,
            failed: failed,
            fGrade: fGrade,
        });
    }

    handleGoalPageChange(gCode, delta) {
        let report = this.state.report;
        report['Deltas'][gCode] = delta;

        let gResults = this.state.gResults;
        gResults[gCode] = this.processGoalDiffs(report, this.state.gMedians, gCode);

        let failed = sheet.processGoals(gResults);

        let fGrade = sheet.finalGrade(this.state.eMean, failed, this.state.cMean);

        this.setState({
            report: report,
            gResults: gResults,
            failed: failed,
            fGrade: fGrade,
        });
    }

    handlePageNameClick(event) {
        let index = parseInt(event.target.getAttribute('data-index'));
        this.setState({
            index: index,
        });
    }

    render() {
        if (this.schemaMissing) {
            let key = (new URLSearchParams(window.location.search)).get('schema');
            if (!(key in this.schema)) {
                return (
                    <form>
                        <p>não modifique o endereço da página</p>
                    </form>
                );
            }
            this.schemaMissing = false;
            this.schema = this.schema[key];
        }

        if (this.stateMissing) {
            return [
                <form key="form">
                    <p>carregue o relatório recebido por email</p>
                    <input type="file" onChange={this.handleFileInputChange} />
                    <p className={this.state.error ? 'alert' : 'hidden'}>não foi possível ler o arquivo</p>
                </form>,
                <footer key="footer">
                </footer>,
            ];
        }

        let low = this.state.eMean < 5;

        let names = [
            'Diagnósticos',
            'Avaliações',
            'Objetivos',
            'Médias',
        ];

        let pages = [
            <DiagPage
                schema={this.schema}
                report={this.state.report}
                onChange={this.handleDiagPageChange}
            />,
            <EvalPage
                schema={this.schema}
                report={this.state.report}
                reverse={this.reverse}
                onChange={this.handleEvalPageChange}
            />,
            <GoalPage
                schema={this.schema}
                report={this.state.report}
                gMedians={this.state.gMedians}
                gResults={this.state.gResults}
                onEvalChange={this.handleEvalPageChange}
                onGoalChange={this.handleGoalPageChange}
            />,
            <MeanPage
                eMean={this.state.eMean}
                gResults={this.state.gResults}
                failed={this.state.failed}
                cMean={this.state.cMean}
                fGrade={this.state.fGrade}
                low={low}
            />,
        ];

        return [
            <header key="header">
                <nav>
                    <ul>
                        {names.map((name, index) => {
                            let classList = [];
                            if (index === this.state.index) {
                                classList.push('current');
                            }
                            if (name === 'Médias' && (low || this.state.failed)) {
                                classList.push('alert');
                            } else if (name === 'Objetivos' && this.state.failed) {
                                classList.push('alert');
                            }
                            return (
                                <li
                                    key={index}
                                    className={classList.length ? classList.join(' ') : null}
                                    data-index={index}
                                    onClick={this.handlePageNameClick}
                                >
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
            <footer key="footer">
            </footer>,
        ];
    }
}

export default App;
