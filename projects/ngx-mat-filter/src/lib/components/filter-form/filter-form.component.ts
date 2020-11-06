import { AfterViewInit, ChangeDetectorRef, Component, forwardRef, Input, OnChanges, OnInit } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
  Validators
} from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { FilterCriteria } from '../../models/criteria';
import { Field } from '../../models/field';
import { TYPE } from '../../models/field-type';
import { Operator, Operators } from '../../models/operator';
import { ValidatorService } from '../../services/validator.service';

@Component({
  selector: 'ngx-mat-filter-form',
  templateUrl: './filter-form.component.html',
  styleUrls: ['./filter-form.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxMatFilterFormComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => NgxMatFilterFormComponent),
      multi: true
    }
  ]
})
export class NgxMatFilterFormComponent implements OnInit, OnChanges, AfterViewInit, ControlValueAccessor, Validator {
  @Input() fields: Field[];
  @Input() data: FilterCriteria;
  filtered: Field[];
  operators: Operator[];
  form: FormGroup;
  onTouched: () => void = () => {};

  constructor(public builder: FormBuilder, public validator: ValidatorService, private cdr: ChangeDetectorRef) {}

  validate(control: AbstractControl): ValidationErrors {
    return this.form.valid
      ? null
      : {
          ngxFilterForm: true
        };
  }

  writeValue(val: any): void {
    if (val) {
      this.form.setValue(
        {
          field: val.field,
          sort: val.sort
        },
        { emitEvent: false }
      );
    } else {
      this.form.reset();
    }
  }

  registerOnChange(fn: any): void {
    this.form.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.form.disable() : this.form.enable();
  }

  ngOnInit() {
    this.setupForm();
  }

  ngOnChanges() {
    if (this.fields) {
      this.filtered = this.fields.filter((field: Field) => {
        const key = 'filter';
        if (field.hasOwnProperty(key)) {
          return field[key];
        } else {
          return true;
        }
      });
    } else {
      this.filtered = [];
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.data) {
        this.fill();
      }
    });
  }

  getOperators(field: Field) {
    return Object.keys(Operators)
      .filter((key) => {
        return Operators[key].type.includes(field.type);
      })
      .map((key) => Operators[key]);
  }

  fill() {
    const field = this.fields.find(({ key }) => key === this.data.field.key);
    this.operators = this.getOperators(field);
    const operator = this.operators.find(({ id }) => id === this.data.operator.id);
    const type = this.data.field.type;
    const value = this.data.value;
    this.form.patchValue({
      field: field,
      operator: operator
    });

    if (TYPE.AUTO_COMPLETE === type) {
      this.form.patchValue({
        value: {
          first: field.options.find(({ id }) => id === value.first.id)
        }
      });
    } else if (TYPE.DATE === type) {
      if (Operators.DateRange === operator) {
        this.form.patchValue({
          value: value
        });
      } else {
        this.form.patchValue({
          value: {
            first: value.first
          }
        });
      }
    } else if (TYPE.MULTI_SELECT === type) {
      this.form.patchValue({
        value: {
          first: field.options.filter(({ id }) => !!value.first.find(({ tId }) => tId === id))
        }
      });
    } else if (TYPE.NUMBER === type) {
      if (Operators.NumberRange === operator) {
        this.form.patchValue({
          value: value
        });
      } else {
        this.form.patchValue({
          value: {
            first: value.first
          }
        });
      }
    } else if (TYPE.SELECT === type) {
      this.form.patchValue({
        value: {
          first: field.options.find(({ id }) => id === value.first.id)
        }
      });
    } else if (TYPE.TEXT === type) {
      this.form.patchValue({
        value: {
          first: value.first
        }
      });
    }
  }

  selectField(event: MatSelectChange) {
    this.form.get('value').reset();
    const field = event.value;
    this.operators = this.getOperators(field);
    this.form.patchValue({
      operator: this.operators[0]
    });
    this.cdr.detectChanges();
  }

  setupForm() {
    this.form = this.builder.group({
      field: [null, Validators.required],
      operator: [null, Validators.required],
      value: []
    });
  }
}
