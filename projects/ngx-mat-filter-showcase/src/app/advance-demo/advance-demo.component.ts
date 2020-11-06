import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { createFilter, createSort, Field, FIELD_TYPE, NgxMatFilterWorker, Operators, Sorts } from 'ngx-mat-filter';
import { ColorOptions, FakeService, MaterialOptions, Product, ProviderOptions } from '../services/fake.service';

@Component({
  selector: 'app-advance-demo',
  templateUrl: './advance-demo.component.html',
  styleUrls: ['./advance-demo.component.css']
})
export class AdvanceDemoComponent implements OnInit {
  worker: NgxMatFilterWorker;
  fields: Field[];
  displayedColumns: string[] = ['name', 'material', 'color', 'price', 'date', 'provider'];
  dataSource: MatTableDataSource<Product>;
  items: Product[];

  constructor(private fake: FakeService) {}

  ngOnInit(): void {
    this.items = this.fake.getData();
    this.setupFields();
    this.setupWorker();
  }

  ngOnDestroy() {
    this.worker.destroy();
  }

  setBatch() {
    this.worker.setBatch(
      [
        createFilter('material', Operators.Equals, this.items[0].material),
        createFilter('price', Operators.NumberRange, this.items[0].price - 100, this.items[0].price + 100)
      ],
      [createSort('price', Sorts.ASC)]
    );
  }

  setupWorker() {
    this.worker = new NgxMatFilterWorker();
    this.worker.setFields(this.fields);
    this.worker.dataChange.subscribe((data: any[]) => {
      this.dataSource = new MatTableDataSource(data);
    });
    this.worker.setData(this.items);
    this.worker.update();
  }

  setupFields() {
    this.fields = [
      {
        key: 'name',
        name: 'Product Name',
        type: FIELD_TYPE.TEXT
      },
      {
        key: 'material',
        name: 'Material',
        type: FIELD_TYPE.SELECT,
        options: MaterialOptions,
        sortKey: 'materialName'
      },
      {
        key: 'color',
        name: 'Color',
        type: FIELD_TYPE.MULTI_SELECT,
        options: ColorOptions,
        sortKey: 'colorName'
      },
      {
        key: 'price',
        name: 'Price',
        type: FIELD_TYPE.NUMBER
      },
      {
        key: 'date',
        name: 'Date',
        type: FIELD_TYPE.DATE
      },
      {
        key: 'provider',
        name: 'Provider',
        type: FIELD_TYPE.AUTO_COMPLETE,
        sortKey: 'providerName',
        options: ProviderOptions
      }
    ];
  }
}
