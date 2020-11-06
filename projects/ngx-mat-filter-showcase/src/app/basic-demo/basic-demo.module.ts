import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '../material/material.module';
import { BasicDemoRoutingModule } from './basic-demo-routing.module';
import { BasicDemoComponent } from './basic-demo.component';
import { NgxMatFilterModule } from 'ngx-mat-filter';

@NgModule({
  declarations: [BasicDemoComponent],
  imports: [CommonModule, BasicDemoRoutingModule, NgxMatFilterModule, MaterialModule, FlexLayoutModule]
})
export class BasicDemoModule {}
