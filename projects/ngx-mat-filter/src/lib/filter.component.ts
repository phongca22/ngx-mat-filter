import { Component, Input, OnInit } from '@angular/core';
import { Field } from './models/field';
import { NgxMatFilterWorker } from './models/worker';

@Component({
  selector: 'ngx-mat-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class NgxMatFilterComponent implements OnInit {
  @Input() worker: NgxMatFilterWorker;
  @Input() fields: Field[];
  @Input() hideChip: boolean;

  constructor() {}

  ngOnInit() {}
}
