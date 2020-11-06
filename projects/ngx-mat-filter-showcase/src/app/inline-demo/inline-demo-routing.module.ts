import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InlineDemoComponent } from './inline-demo.component';

const routes: Routes = [{ path: '', component: InlineDemoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InlineDemoRoutingModule { }
