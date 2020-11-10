import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs/operators';
import { FilterCriteria, SortCriteria } from '../../models/criteria';
import { Field } from '../../models/field';
import { NgxMatFilterWorker } from '../../models/worker';
import { FilterDialogComponent } from '../filter-dialog/filter-dialog.component';
import { SortDialogComponent } from '../sort-dialog/sort-dialog.component';

const PANEL_CLASS = 'ngx-mat-filter-dialog';
@Component({
  selector: 'ngx-mat-filter-button',
  templateUrl: './filter-button.component.html',
  styleUrls: ['./filter-button.component.css']
})
export class FilterButtonComponent implements OnInit {
  @Input() worker: NgxMatFilterWorker<any>;
  @Input() fields: Field[];
  @Input() sort: boolean;
  @ViewChild('button', { read: ElementRef }) button: ElementRef;

  constructor(private dialog: MatDialog) {}

  ngOnInit() {
    if (this.sort) {
      this.worker.getSortEvent().subscribe((data: SortCriteria) => {
        this.showSortDialog(data);
      });
    } else {
      this.worker.getFilterEvent().subscribe((data: FilterCriteria) => {
        this.showFilterDialog(data);
      });
    }
  }

  show() {
    if (this.sort) {
      this.showSortDialog();
    } else {
      this.showFilterDialog();
    }
  }

  showFilterDialog(data?: FilterCriteria) {
    this.dialog
      .open(FilterDialogComponent, {
        data: {
          fields: this.fields,
          target: this.button.nativeElement,
          criteria: data
        },
        autoFocus: false,
        panelClass: PANEL_CLASS,
        restoreFocus: false
      })
      .afterClosed()
      .pipe(filter((val: FilterCriteria) => !!val))
      .subscribe((val: FilterCriteria) => {
        this.worker.addFilter(val);
      });
  }

  showSortDialog(data?: SortCriteria) {
    this.dialog
      .open(SortDialogComponent, {
        data: {
          fields: this.fields,
          target: this.button.nativeElement,
          criteria: data
        },
        autoFocus: false,
        panelClass: PANEL_CLASS,
        restoreFocus: false
      })
      .afterClosed()
      .pipe(filter((val: SortCriteria) => !!val))
      .subscribe((val: SortCriteria) => {
        this.worker.addSort(val);
      });
  }
}
