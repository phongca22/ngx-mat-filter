import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdvanceDemoComponent } from './advance-demo.component';

const routes: Routes = [{ path: '', component: AdvanceDemoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdvanceDemoRoutingModule { }
