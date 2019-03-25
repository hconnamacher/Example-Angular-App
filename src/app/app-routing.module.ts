import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { ViewComponent } from './view/view.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'feedback', component: FeedbackComponent},
  {path: 'projects', component: ViewComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
