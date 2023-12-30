export default {
    convert: function (grade) {
        switch (grade) {
            case 'A+':
                return 10;
            case 'A':
                return 9;
            case 'B+':
                return 8;
            case 'B':
                return 7;
            case 'C+':
                return 6;
            case 'C':
                return 5;
            case 'D':
                return 2.5;
            default:
                return 0;
        }
    },


    round: function (mean) {
        return Math.round(100 * mean) / 100;
    },


    weightedMean: function (weights, grades) {
        let sum = 0;
        let num = 0;

        for (let i = 0; i < weights.length; i++) {
            sum += weights[i] * this.convert(grades[i]);
            num += weights[i];
        }

        return this.round(sum / num);
    },


    goalMedian: function (args) {
        let grades = [];

        for (let i = 0; i < args.length; i++) {
            grades.push(this.convert(args[i]));
        }

        grades.sort(function (a, b) { return a - b; });

        let index = Math.floor((grades.length - 1) / 2);

        if (grades.length % 2 === 0) {
            return (grades[index] + grades[index + 1]) / 2;
        }
        return grades[index];
    },


    goalMaximum: function (args) {
        let grades = [];

        for (let i = 0; i < args.length; i++) {
            grades.push(this.convert(args[i]));
        }

        return Math.max(...grades);
    },


    goalResult: function (median, delta) {
        return median >= 4.5 || delta === 'S';
    },


    processGoals: function (gResults) {
        return Object.values(gResults).includes(false);
    },


    finalGrade: function (eMean, failed, dMean) {
        if (failed) {
            return Math.min(eMean, 4);
        }
        if (eMean < 5) {
            return eMean;
        }

        let cMean = this.round(0.9 * eMean + 0.1 * dMean);

        return Math.max(cMean, 5);
    }
};
