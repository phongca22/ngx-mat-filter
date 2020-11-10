import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  createAutocompleteField,
  createDateField,
  createMultiSelectField,
  createNumberField,
  createSelectField,
  createTextField,
  Field,
  NgxMatFilterWorker
} from 'ngx-mat-filter';
import { ColorOptions, FakeService, MaterialOptions, Product, ProviderOptions } from '../services/fake.service';
@Component({
  selector: 'app-basic-demo',
  templateUrl: './basic-demo.component.html',
  styleUrls: ['./basic-demo.component.scss']
})
export class BasicDemoComponent implements OnInit, OnDestroy {
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

  setupWorker() {
    this.worker = new NgxMatFilterWorker();
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
