import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  createAutocompleteField,
  createDateField,
  createMultiSelectField,
  createNumberField,
  createSelectField,
  createTextField,
  Field,
  NgxMatFilterWorker,
  createFilter,
  createSort,
  Operators,
  Sorts
} from 'ngx-mat-filter';
import { ColorOptions, FakeService, MaterialOptions, Product, ProviderOptions } from '../services/fake.service';

@Component({
  selector: 'app-advance-demo',
  templateUrl: './advance-demo.component.html',
  styleUrls: ['./advance-demo.component.css']
})
export class AdvanceDemoComponent implements OnInit {
  worker: NgxMatFilterWorker<Product>;
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
    this.worker.getDataChange().subscribe((data: Product[]) => {
      this.dataSource = new MatTableDataSource(data);
    });
    this.worker.setData(this.items);
    this.worker.update();
  }

  setupFields() {
    this.fields = [
      createTextField({
        key: 'name',
        name: 'Product Name'
      }),
      createSelectField({
        key: 'material',
        name: 'Material',
        options: MaterialOptions,
        sortKey: 'materialName'
      }),
      createMultiSelectField({
        key: 'color',
        name: 'Color',
        options: ColorOptions,
        sortKey: 'colorName'
      }),
      createNumberField({
        key: 'price',
        name: 'Price'
      }),
      createDateField({
        key: 'date',
        name: 'Date'
      }),
      createAutocompleteField({
        key: 'provider',
        name: 'Provider',
        sortKey: 'providerName',
        options: ProviderOptions
      })
    ];
  }
}
