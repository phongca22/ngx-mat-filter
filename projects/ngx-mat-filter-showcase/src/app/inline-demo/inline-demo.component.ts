import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Field, TYPE, NgxMatFilterWorker } from 'ngx-mat-filter';
import { ColorOptions, FakeService, MaterialOptions, Product, ProviderOptions } from '../services/fake.service';

@Component({
  selector: 'app-inline-demo',
  templateUrl: './inline-demo.component.html',
  styleUrls: ['./inline-demo.component.css']
})
export class InlineDemoComponent implements OnInit {
  worker: NgxMatFilterWorker;
  fields: Field[];
  displayedColumns: string[] = ['name', 'material', 'color', 'price', 'date', 'provider'];
  dataSource: MatTableDataSource<Product>;
  items: Product[];
  form: FormGroup;

  constructor(private fake: FakeService) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      filter: new FormControl(),
      sort: new FormControl()
    });
    this.items = this.fake.getData();
    this.setupFields();
    this.setupWorker();
  }

  ngOnDestroy() {
    this.worker.destroy();
  }

  setupWorker() {
    this.worker = new NgxMatFilterWorker();
    this.worker.dataChange.subscribe((data: any[]) => {
      this.dataSource = new MatTableDataSource(data);
    });
    this.worker.setData(JSON.parse(JSON.stringify(this.items)));
    this.worker.update();
  }

  setupFields() {
    this.fields = [
      {
        key: 'name',
        name: 'Product Name',
        type: TYPE.TEXT
      },
      {
        key: 'material',
        name: 'Material',
        type: TYPE.SELECT,
        options: MaterialOptions,
        sortKey: 'materialName'
      },
      {
        key: 'color',
        name: 'Color',
        type: TYPE.MULTI_SELECT,
        options: ColorOptions,
        sortKey: 'colorName'
      },
      {
        key: 'price',
        name: 'Price',
        type: TYPE.NUMBER
      },
      {
        key: 'date',
        name: 'Date',
        type: TYPE.DATE
      },
      {
        key: 'provider',
        name: 'Provider',
        type: TYPE.AUTO_COMPLETE,
        sortKey: 'providerName',
        options: ProviderOptions
      }
    ];
  }

  addFilter() {
    this.worker.addFilter(this.form.value.filter);
    this.form.reset();
  }

  addSort() {
    this.worker.addSort(this.form.value.sort);
    this.form.reset();
  }
}
