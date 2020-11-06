import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMatFilterModule } from 'ngx-mat-filter';
import { MaterialModule } from '../material/material.module';
import { InlineDemoRoutingModule } from './inline-demo-routing.module';
import { InlineDemoComponent } from './inline-demo.component';

@NgModule({
  declarations: [InlineDemoComponent],
  imports: [
    CommonModule,
    InlineDemoRoutingModule,
    NgxMatFilterModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule
  ]
})
export class InlineDemoModule {}
