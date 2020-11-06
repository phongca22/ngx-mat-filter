import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMatFilterChipComponent } from './components/chip/chip.component';
import { FilterButtonComponent } from './components/filter-button/filter-button.component';
import { FilterDialogComponent } from './components/filter-dialog/filter-dialog.component';
import { NgxMatFilterFormComponent } from './components/filter-form/filter-form.component';
import { InputComponent } from './components/input/input.component';
import { SortDialogComponent } from './components/sort-dialog/sort-dialog.component';
import { NgxFilterSortFormComponent } from './components/sort-form/sort-form.component';
import { NgxMatFilterComponent } from './filter.component';
import { MaterialModule } from './material/material.module';
@NgModule({
  declarations: [
    NgxMatFilterChipComponent,
    InputComponent,
    NgxMatFilterChipComponent,
    FilterButtonComponent,
    FilterDialogComponent,
    SortDialogComponent,
    NgxMatFilterFormComponent,
    NgxFilterSortFormComponent,
    NgxMatFilterComponent
  ],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MaterialModule, FlexLayoutModule],
  exports: [NgxMatFilterComponent, NgxMatFilterChipComponent, NgxMatFilterFormComponent, NgxFilterSortFormComponent],
  entryComponents: [FilterDialogComponent, SortDialogComponent]
})
export class NgxMatFilterModule {}
