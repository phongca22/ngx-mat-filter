import { Injectable } from '@angular/core';
import faker from 'faker';

function random(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function generate(size: number, fn: Function): any[] {
  return [...new Set([...Array(size).keys()].map(() => fn()))].map((val: string, index: number) => ({
    id: index,
    name: val
  }));
}

export interface Product {
  name: string;
  price: number;
  material: number;
  materialName: string;
  color: number;
  colorName: string;
  date: Date;
  provider: number;
  providerName: string;
}

export const ColorOptions = generate(10, faker.commerce.color);
export const MaterialOptions = generate(10, faker.commerce.productMaterial);
export const ProviderOptions = generate(10, faker.commerce.department);

@Injectable({
  providedIn: 'root'
})
export class FakeService {
  constructor() {}

  getData(): Product[] {
    return [...Array(10).keys()].map(() => {
      const color = ColorOptions[random(0, ColorOptions.length - 1)];
      const material = MaterialOptions[random(0, MaterialOptions.length - 1)];
      const provider = ProviderOptions[random(0, ProviderOptions.length - 1)];
      const item: Product = {
        name: faker.commerce.productName(),
        price: faker.random.float(),
        material: material.id,
        materialName: material.name,
        color: color.id,
        colorName: color.name,
        date: faker.date.past(),
        provider: provider.id,
        providerName: provider.name
      };
      return item;
    });
  }
}
