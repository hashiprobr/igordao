export default {
  rubric: function(feedbacks) {
    var nt = 0;
    var np = 0;

    for (var i = 0; i < feedbacks.length; i++) {
      switch (feedbacks[i]) {
        case 'T':
          nt++;
          break;
        case 'P':
          np++;
          break;
        default:
      }
    }

    if (nt < 2) {
      return 'I';
    }
    if (nt < 3) {
      return 'D';
    }
    if (nt < 4) {
      if (np < 1) {
        return 'C';
      }
      if (np < 2) {
        return 'C+';
      }
      return 'B';
    }
    if (nt < 5) {
      if (np < 1) {
        return 'B+';
      }
      return 'A';
    }
    return 'A+';
  },

  merge: function(grades) {
    var sum = 0;

    for (var i = 0; i < grades.length; i++) {
      switch (grades[i]) {
        case 'A+':
          sum += 10;
          break;
        case 'A':
          sum += 9
          break;
        case 'B+':
          sum += 8
          break;
        case 'B':
          sum += 7
          break;
        case 'C+':
          sum += 6
          break;
        case 'C':
          sum += 5
          break;
        case 'D':
          sum += 2.5
          break;
        default:
      }
    }

    var mean = sum / grades.length;

    if (mean < 2.25)  {
      return 'I';
    }
    if (mean < 4.5)  {
      return 'D';
    }
    if (mean < 5.5)  {
      return 'C';
    }
    if (mean < 6.5)  {
      return 'C+';
    }
    if (mean < 7.5)  {
      return 'B';
    }
    if (mean < 8.5)  {
      return 'B+';
    }
    if (mean < 9.5)  {
      return 'A';
    }
    return 'A+';
  },

  mergepp: function(grades) {
    var sum = 0;

    var min = 10;

    for (var i = 0; i < grades.length; i++) {
      switch (grades[i]) {
        case 'A+':
          if (min > 10) min = 10;
          sum += 10;
          break;
        case 'A':
          if (min > 9) min = 9;
          sum += 9
          break;
        case 'B+':
          if (min > 8) min = 8;
          sum += 8
          break;
        case 'B':
          if (min > 7) min = 7;
          sum += 7
          break;
        case 'C+':
          if (min > 6) min = 6;
          sum += 6
          break;
        case 'C':
          if (min > 5) min = 5;
          sum += 5
          break;
        case 'D':
          if (min > 2.5) min = 2.5;
          sum += 2.5
          break;
        default:
          if (min > 0) min = 0;
      }
    }

    var mean = (sum - min) / (grades.length - 1);

    if (mean < 2.25)  {
      return 'I';
    }
    if (mean < 4.5)  {
      return 'D';
    }
    if (mean < 5.5)  {
      return 'C';
    }
    if (mean < 6.5)  {
      return 'C+';
    }
    if (mean < 7.5)  {
      return 'B';
    }
    if (mean < 8.5)  {
      return 'B+';
    }
    if (mean < 9.5)  {
      return 'A';
    }
    return 'A+';
  },

  convert: function(grade) {
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

  round: function(mean) {
    return Math.round(100 * mean) / 100;
  },

  weightedMean: function(weights, grades) {
    if (!Array.isArray(weights)) {
      return this.convert(grades);
    }

    var sum = 0;
    var num = 0;

    for (var i = 0; i < weights.length; i++) {
      sum += weights[i] * this.convert(grades[i]);
      num += weights[i];
    }

    return this.round(sum / num);
  },

  goalMedian: function(args) {
    var grades = [];

    for (var i = 0; i < args.length; i++) {
      grades.push(this.convert(args[i]));
    }

    grades.sort(function(a, b) { return a - b; });

    var index = Math.floor((grades.length - 1) / 2);

    if (grades.length % 2 === 0) {
      return (grades[index] + grades[index + 1]) / 2;
    }
    return grades[index];
  },

  goalResult: function(median, delta) {
    if (median >= 4.5 || delta === 'S') {
      return 'APR';
    }
    return 'REP';
  },

  finalMean: function(goalResults, essentialMean, complementaryMean) {
    var failed = false;

    for (var i = 0; i < goalResults[0].length; i++) {
      if (goalResults[0][i] === 'REP') {
        failed = true;
        break;
      }
    }

    if (failed) {
      return Math.min(4, essentialMean);
    }

    if (essentialMean < 5) {
      return essentialMean;
    }

    return Math.min(10, this.round(essentialMean + 0.1 * complementaryMean));
  }
};
