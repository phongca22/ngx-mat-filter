import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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
  selector: 'app-inline-demo',
  templateUrl: './inline-demo.component.html',
  styleUrls: ['./inline-demo.component.css']
})
export class InlineDemoComponent implements OnInit {
  worker: NgxMatFilterWorker<Product>;
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
    this.worker.getDataChange().subscribe((data: Product[]) => {
      this.dataSource = new MatTableDataSource(data);
    });
    this.worker.setData(JSON.parse(JSON.stringify(this.items)));
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

  addFilter() {
    this.worker.addFilter(this.form.value.filter);
    this.form.reset();
  }

  addSort() {
    this.worker.addSort(this.form.value.sort);
    this.form.reset();
  }
}
