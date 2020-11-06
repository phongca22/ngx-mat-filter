import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SortCriteria } from '../../models/criteria';
import { Field } from '../../models/field';

export interface SortDialogConfig {
  fields: Field[];
  target: HTMLElement;
  criteria: SortCriteria;
}
@Component({
  selector: 'ngx-mat-filter-sort-dialog',
  templateUrl: './sort-dialog.component.html',
  styleUrls: ['./sort-dialog.component.css']
})
export class SortDialogComponent implements OnInit {
  form: FormGroup;
  sorts: any[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: SortDialogConfig,
    private dialog: MatDialogRef<SortDialogComponent>
  ) {}

  ngOnInit(): void {
    this.updatePosition();
    this.form = new FormGroup({
      sort: new FormControl()
    });
  }

  updatePosition() {
    const box = this.data.target.getBoundingClientRect();
    this.dialog.updatePosition({
      top: box.bottom + 'px',
      left: box.left + 'px'
    });
  }

  add() {
    this.dialog.close(this.form.value.sort);
  }
}
