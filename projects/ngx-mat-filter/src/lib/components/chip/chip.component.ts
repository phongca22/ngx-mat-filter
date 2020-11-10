import { Component, Input, OnInit } from '@angular/core';
import { FilterCriteria, SortCriteria } from '../../models/criteria';
import { NgxMatFilterWorker } from '../../models/worker';

@Component({
  selector: 'ngx-mat-filter-chip',
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.css']
})
export class NgxMatFilterChipComponent implements OnInit {
  @Input() worker: NgxMatFilterWorker<any>;
  @Input() hideIcon: boolean;
  @Input() hideClear: boolean;
  items: any[] = [];

  constructor() {}

  ngOnInit() {
    this.worker
      .getCriteriaChange()
      .subscribe(({ filters, sorts }: { filters: FilterCriteria[]; sorts: SortCriteria[] }) => {
        this.items = [...filters, ...sorts];
      });
  }

  remove(data: any) {
    this.worker.remove(data);
  }

  clearAll() {
    this.worker.clear();
  }

  select(_event: any, data: any) {
    if (data instanceof FilterCriteria) {
      this.worker.editFilter(data);
    } else {
      this.worker.editSort(data);
    }
  }
}
