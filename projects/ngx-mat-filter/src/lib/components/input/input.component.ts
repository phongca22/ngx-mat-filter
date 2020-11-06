import { Component, forwardRef, Input, OnChanges, OnInit } from '@angular/core';
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
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { BaseComponent } from '../../models/base-component';
import { Field } from '../../models/field';
import { TYPE } from '../../models/field-type';
import { Operator, Operators } from '../../models/operator';
import { ValidatorService } from '../../services/validator.service';

@Component({
  selector: 'ngx-filter-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent extends BaseComponent implements OnInit, OnChanges, ControlValueAccessor, Validator {
  @Input() operator: Operator;
  @Input() field: Field;
  form: FormGroup;
  Type = TYPE;
  Operators = Operators;
  filteredValues: Observable<any>;
  isDate: boolean;
  isText: boolean;
  isNumber: boolean;
  isSelect: boolean;
  isMultiSelect: boolean;
  isAutoComplete: boolean;
  isBoolean: boolean;

  onTouched: () => void = () => {};

  constructor(private builder: FormBuilder, private validator: ValidatorService) {
    super();
  }

  writeValue(value: { first: any; second: any }): void {
    if (value) {
      this.form.setValue(
        {
          first: value.first,
          second: value.second || null
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

  validate(control: AbstractControl): ValidationErrors {
    return this.form.valid
      ? null
      : {
          ngxFilterInput: true
        };
  }

  ngOnInit() {
    this.setupForm();
    this.filteredValues = this.form.get('first').valueChanges.pipe(
      this.getDestroyer(),
      startWith<any>(''),
      map((value) => (typeof value === 'string' ? value : value && value.name)),
      map((name) => (name ? this._filter(name) : this.field.options))
    );
  }

  ngOnChanges() {
    this.getFieldType();
    if (this.form) {
      this.updateFieldValidator();
    }
  }

  private updateFieldValidator() {
    if (Operators.NumberRange === this.operator) {
      this.form.get('second').enable();
      this.form
        .get('second')
        .setValidators([Validators.required, this.validator.isGreaterThan(this.form.get('first'))]);
      this.form.get('first').setValidators([Validators.required, this.validator.isLessThan(this.form.get('second'))]);
    } else if (Operators.DateRange === this.operator) {
      this.form.get('second').enable();
      this.form.get('second').setValidators(Validators.required);
      this.form.get('first').setValidators(Validators.required);
    } else {
      this.form.get('second').disable();
      this.form.get('second').setValidators(Validators.required);
      this.form.get('first').setValidators(Validators.required);
    }

    this.form.get('first').updateValueAndValidity();
    this.form.get('second').updateValueAndValidity();
  }

  private getFieldType() {
    this.isDate = this.field?.type === TYPE.DATE;
    this.isText = this.field?.type === TYPE.TEXT;
    this.isNumber = this.field?.type === TYPE.NUMBER;
    this.isSelect = this.field?.type === TYPE.SELECT;
    this.isMultiSelect = this.field?.type === TYPE.MULTI_SELECT;
    this.isAutoComplete = this.field?.type === TYPE.AUTO_COMPLETE;
  }

  setupForm() {
    this.form = this.builder.group({
      first: [],
      second: []
    });
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.field.options.filter((val) => val.name && val.name.toLowerCase().includes(filterValue.toLowerCase()));
  }

  displayFn(item?: any): string | undefined {
    return item ? item.name : undefined;
  }

  isDateRange(): boolean {
    return Operators.DateRange === this.operator;
  }

  isNumberRange(): boolean {
    return Operators.NumberRange === this.operator;
  }
}
