import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Field, FIELD_TYPE, NgxMatFilterWorker } from 'ngx-mat-filter';
import { ColorOptions, FakeService, MaterialOptions, Product, ProviderOptions } from '../services/fake.service';
@Component({
  selector: 'app-basic-demo',
  templateUrl: './basic-demo.component.html',
  styleUrls: ['./basic-demo.component.scss']
})
export class BasicDemoComponent implements OnInit, OnDestroy {
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

  setupWorker() {
    this.worker = new NgxMatFilterWorker();
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
