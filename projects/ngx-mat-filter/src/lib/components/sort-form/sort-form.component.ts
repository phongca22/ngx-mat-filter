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
import { SortCriteria } from '../../models/criteria';
import { Field } from '../../models/field';
import { Sort, Sorts } from '../../models/sort';
import { NgxMatFilterWorker } from '../../models/worker';

@Component({
  selector: 'ngx-mat-filter-sort-form',
  templateUrl: './sort-form.component.html',
  styleUrls: ['./sort-form.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxFilterSortFormComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => NgxFilterSortFormComponent),
      multi: true
    }
  ]
})
export class NgxFilterSortFormComponent implements OnInit, OnChanges, AfterViewInit, ControlValueAccessor, Validator {
  @Input() worker: NgxMatFilterWorker;
  @Input() fields: Field[];
  @Input() data: SortCriteria;
  form: FormGroup;
  filtered: Field[];
  operators: any[];
  sorts: any[];
  onTouched: () => void = () => {};

  constructor(private builder: FormBuilder, private cdr: ChangeDetectorRef) {}

  writeValue(val: { field: Field; sort: Sort }): void {
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

  validate(control: AbstractControl): ValidationErrors {
    return this.form.valid
      ? null
      : {
          ngxFilterSort: true
        };
  }

  ngOnInit(): void {
    this.setupForm();
    this.sorts = [Sorts.ASC, Sorts.DESC];
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.data) {
        this.fill();
      }
    });
  }

  ngOnChanges() {
    if (this.fields) {
      this.filtered = this.fields.filter((field: Field) => {
        const key = 'sort';
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

  fill() {
    this.form.setValue({
      field: this.filtered.find(({ key }) => key === this.data.field.key),
      sort: this.sorts.find(({ id }) => id === this.data.sort.id)
    });
    this.cdr.detectChanges();
  }

  setupForm() {
    this.form = this.builder.group({
      field: [null, Validators.required],
      sort: [null, Validators.required]
    });
  }
}
