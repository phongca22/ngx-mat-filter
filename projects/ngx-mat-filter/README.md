# ngx-mat-filter

## Support field type
- Input text or number
- Select or checklist
- Autocomplete
- Date picker

## Try it

- [Filter & Sort widget](https://stackblitz.com/edit/ngx-mat-filter-widget)
- [Use reactive form](https://stackblitz.com/edit/ngx-mat-filter-form)
- [Manual batch setting](https://stackblitz.com/edit/ngx-filter-basic-demo)

## Installation

### Peer Dependencies:
| Package Name      | Version |
| :--- | :--- |
| @angular/common      | ^9.1.12       |
| @angular/core   | ^9.1.12        |
|moment|^2.29.1|
|@angular/cdk|^9.2.4|
|@angular/flex-layout|^9.0.0-beta.31|
|@angular/material|^9.2.4|

### Install ngx-mat-filter
```cmd
npm install ngx-mat-filter
```

#### Choose the version corresponding to your Angular version:

| Angular | Angular Material | ngx-filter |
| ------- | ---------------- | ---------- |
| 9       | 9                | 1.x+       |

#### Add needed package to NgModule imports:

```ts
import { NgxMatFilterModule } from 'ngx-mat-filter';

@NgModule({
  ...
  imports: [NgxMatFilterModule,...]
  ...
})
```

## Usage

#### Add component to your page:

```html
<ngx-mat-filter [worker]="worker" [fields]="fields]></ngx-mat-filter>
```

#### Setup Worker:

```ts
constructor() {
  this.worker = new NgxMatFilterWorker();
}
```

#### Setup fields:

```ts
this.fields = [
  {
    key: 'name',
    name: 'Product Name',
    type: FIELD_TYPE.TEXT
  }
];
```

#### Initialize data:

```ts
this.worker.setData(this.items);
this.worker.update();
```

#### Data change:

```ts
this.worker.dataChange.subscribe((data: any[]) => {
  //filtered data
});
```

#### Destroy worker:

```ts
ngOnDestroy() {
  this.worker.destroy();
}
```

## License

[MIT](https://github.com/phongca22/ngx-filter/blob/main/LICENSE)
