import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxMatFilterModule } from 'ngx-mat-filter';
import { MaterialModule } from '../material/material.module';
import { AdvanceDemoRoutingModule } from './advance-demo-routing.module';
import { AdvanceDemoComponent } from './advance-demo.component';

@NgModule({
  declarations: [AdvanceDemoComponent],
  imports: [CommonModule, AdvanceDemoRoutingModule, NgxMatFilterModule, MaterialModule, FlexLayoutModule]
})
export class AdvanceDemoModule {}
