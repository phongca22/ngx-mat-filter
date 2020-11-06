import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FilterCriteria } from '../../models/criteria';
import { Field } from '../../models/field';

export interface FilterDialogConfig {
  fields: Field[];
  target: HTMLElement;
  criteria: FilterCriteria;
}

@Component({
  selector: 'ngx-filter-dialog-filter',
  templateUrl: './filter-dialog.component.html',
  styleUrls: ['./filter-dialog.component.css']
})
export class FilterDialogComponent implements OnInit {
  form: FormGroup;
  invalid: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: FilterDialogConfig,
    private dialog: MatDialogRef<FilterDialogComponent>
  ) {}

  ngOnInit(): void {
    this.updatePosition();
    this.setupForm();
  }

  updatePosition() {
    const box = this.data.target.getBoundingClientRect();
    this.dialog.updatePosition({
      top: box.bottom + 'px',
      left: box.left + 'px'
    });
  }

  add() {
    this.dialog.close(this.form.value.filter);
  }

  setupForm() {
    this.form = new FormGroup({
      filter: new FormControl()
    });
  }
}
