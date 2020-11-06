import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'basic', pathMatch: 'full' },
  {
    path: 'basic',
    loadChildren: () => import('./basic-demo/basic-demo.module').then((m) => m.BasicDemoModule)
  },
  {
    path: 'inline',
    loadChildren: () => import('./inline-demo/inline-demo.module').then((m) => m.InlineDemoModule)
  },
  { path: 'advance', loadChildren: () => import('./advance-demo/advance-demo.module').then((m) => m.AdvanceDemoModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
