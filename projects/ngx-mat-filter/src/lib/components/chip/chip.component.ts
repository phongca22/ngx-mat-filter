import { Component, Input, OnInit } from '@angular/core';
import { FilterCriteria } from '../../models/criteria';
import { NgxMatFilterWorker } from '../../models/worker';

@Component({
  selector: 'ngx-mat-filter-chip',
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.css']
})
export class NgxMatFilterChipComponent implements OnInit {
  @Input() worker: NgxMatFilterWorker;
  @Input() hideIcon: boolean;
  @Input() hideClear: boolean;
  items: any[] = [];

  constructor() {}

  ngOnInit() {
    this.worker.criteriaChange.subscribe((data: any[]) => {
      this.items = data;
    });
  }

  remove(data: any) {
    this.worker.remove(data);
  }

  clearAll() {
    this.worker.clear();
  }

  select(event: any, data: any) {
    if (data instanceof FilterCriteria) {
      this.worker.editFilterEvent.next(data);
    } else {
      this.worker.editSortEvent.next(data);
    }
  }
}
