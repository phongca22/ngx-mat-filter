import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BasicDemoComponent } from './basic-demo.component';

const routes: Routes = [
  {
    path: '',
    component: BasicDemoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BasicDemoRoutingModule {}
