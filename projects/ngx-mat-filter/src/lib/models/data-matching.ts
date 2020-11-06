import moment from 'moment';
import { FilterCriteria } from './criteria';
import { FIELD_TYPE } from './field-type';
import { Operators } from './operator';

export class DataMatching {
  isMatch: boolean;
  filters: FilterCriteria[];
  data: any;

  constructor(data: any, filters: FilterCriteria[]) {
    this.data = data;
    this.filters = filters;
    this.isMatch = this.run();
  }

  run() {
    return this.filters.every((item: FilterCriteria) => {
      const type = item.field.type;
      if (FIELD_TYPE.TEXT === type) {
        return this.matchByText(item);
      } else if (FIELD_TYPE.NUMBER === type) {
        return this.matchByNumber(item);
      } else if (FIELD_TYPE.DATE === type) {
        return this.matchByDate(item);
      } else if (FIELD_TYPE.MULTI_SELECT === type) {
        return this.matchByMultiSelect(item);
      } else if (FIELD_TYPE.SELECT === type || FIELD_TYPE.AUTO_COMPLETE === type) {
        return this.matchBySelect(item);
      } else {
        return false;
      }
    });
  }

  matchByText(item: FilterCriteria): boolean {
    let exp = item.value.first;
    let act = this.data[item.field.key];

    if (Operators.NotEqual === item.operator) {
      if (exp && !act) {
        return true;
      } else if (!exp && act) {
        return true;
      } else {
        return act.toLowerCase() !== exp.toLowerCase();
      }
    } else {
      if (!act) {
        return false;
      } else if (Operators.Equals === item.operator) {
        return act.toLowerCase() === exp.toLowerCase();
      } else if (Operators.BeginsWith === item.operator) {
        return act.toLowerCase().startsWith(exp.toLowerCase());
      } else if (Operators.EndsWith === item.operator) {
        return act.toLowerCase().endsWith(exp.toLowerCase());
      } else if (Operators.Contains === item.operator) {
        return act.toLowerCase().includes(exp.toLowerCase());
      } else {
        return false;
      }
    }
  }

  matchByNumber(item: FilterCriteria): boolean {
    var exp = item.value.first;
    var act = this.data[item.field.key];

    if (Operators.NumberRange === item.operator) {
      var min = item.value.first;
      var max = item.value.second;
      if (isNaN(min) || isNaN(max) || isNaN(act)) {
        return false;
      } else {
        min = parseFloat(min);
        max = parseFloat(max);
        act = parseFloat(act);
        return act >= min && act <= max;
      }
    } else if (Operators.NotEqual === item.operator) {
      if (isNaN(exp) && !isNaN(act)) {
        return true;
      } else if (!isNaN(exp) && isNaN(act)) {
        return true;
      } else {
        return parseFloat(act) !== parseFloat(exp);
      }
    } else {
      if (isNaN(exp) || isNaN(act)) {
        return false;
      } else {
        exp = parseFloat(exp);
        act = parseFloat(act);

        if (Operators.LessThan === item.operator) {
          return act < exp;
        } else if (Operators.Equals === item.operator) {
          return act === exp;
        } else if (Operators.GreaterThan === item.operator) {
          return act > exp;
        } else if (Operators.LessThanOrEquals === item.operator) {
          return act <= exp;
        } else if (Operators.GreaterThanOrEquals === item.operator) {
          return act >= exp;
        } else {
          return false;
        }
      }
    }
  }

  matchByDate(item: FilterCriteria): boolean {
    var exp = item.value.first;
    var act = this.data[item.field.key];

    if (Operators.NotEqual === item.operator) {
      if (act == null || !moment(act).isValid()) {
        return true;
      } else {
        return !moment(act).isSame(moment(exp), 'day');
      }
    } else {
      if (Operators.DateRange === item.operator) {
        var from = item.value.first;
        var to = item.value.second;
        from = moment(from);
        to = moment(to);
        act = moment(act);
        return (
          (from.isBefore(act, 'day') || from.isSame(act, 'day')) && (act.isBefore(to, 'day') || act.isSame(to, 'day'))
        );
      } else {
        act = moment(act);
        exp = moment(exp);

        if (Operators.Equals === item.operator) {
          return act.isSame(exp, 'day');
        } else if (Operators.Before === item.operator) {
          return act.isSame(exp, 'day') || act.isBefore(exp, 'day');
        } else if (Operators.After === item.operator) {
          return act.isSame(exp, 'day') || act.isAfter(exp, 'day');
        } else {
          return false;
        }
      }
    }
  }

  matchByMultiSelect(item: FilterCriteria): boolean {
    var exp = item.value.first;
    var act = this.data[item.field.key];

    if (exp != null && act == null) {
      return false;
    } else if (act != null && exp == null) {
      return false;
    } else if (Operators.Equals === item.operator) {
      for (var i = 0; i < exp.length; i++) {
        if (exp[i].id === act) {
          return true;
        }
      }

      return false;
    } else if (Operators.NotEqual === item.operator) {
      for (var i = 0; i < exp.length; i++) {
        if (exp[i].id === act) {
          return false;
        }
      }

      return true;
    } else {
      return false;
    }
  }

  matchBySelect(item: FilterCriteria): boolean {
    var exp = item.value.first;
    var act = this.data[item.field.key];

    if (exp != null && act == null) {
      return false;
    } else if (act != null && exp == null) {
      return false;
    } else if (Operators.Equals === item.operator) {
      return exp.id === act;
    } else if (Operators.NotEqual === item.operator) {
      return exp.id !== act;
    } else {
      return false;
    }
  }
}
