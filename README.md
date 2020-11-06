# ngx-mat-filter

## What is it?

A material component providing a dynamic input for filtering and ordering. It will help you to create a criteria collection easily and is expressed through chip components.

![Basic](https://github.com/phongca22/ngx-mat-filter/blob/main/docs/images/basic.png)

## Support field type

- Text
- Number
- Select
- Checklist
- Autocomplete
- Date

## Try it

- [Filter & Sort widget](https://stackblitz.com/edit/ngx-mat-filter-widget)
- [Use reactive form](https://stackblitz.com/edit/ngx-mat-filter-form)
- [Manual batch setting](https://stackblitz.com/edit/ngx-filter-basic-demo)

## Installation

#### Peer Dependencies:

| Package Name         | Version        |
| :------------------- | :------------- |
| @angular/common      | ^9.1.12        |
| @angular/core        | ^9.1.12        |
| moment               | ^2.29.1        |
| @angular/cdk         | ^9.2.4         |
| @angular/flex-layout | ^9.0.0-beta.31 |
| @angular/material    | ^9.2.4         |

#### Install

```cmd
npm install ngx-mat-filter
```

#### Choose the version corresponding to your Angular version:

| Angular | Angular Material | ngx-mat-filter |
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
    type: TYPE.TEXT
  }
];
```

For `Select`, `Checklist` and `Autocomplete` you need to define `options`:

```ts
{
  key: 'material',
  name: 'Material',
  type: TYPE.SELECT,
  options: [
    { id: 1, name: 'Wood' },
    { id: 2, name: 'Metal' }
  ]
}
```

As you see, we have an array `options` with `id` and `name`. If you make an order with this field, it will not work well.
So you have to add `sortKey` to specify which property will be ordered.

```ts
{
  key: 'material',
  name: 'Material',
  type: TYPE.SELECT,
  options: [
    { id: 1, name: 'Wood' },
    { id: 2, name: 'Metal' }
  ],
  sortKey: 'materialName'
}
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
