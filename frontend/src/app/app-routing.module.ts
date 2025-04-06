import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { IndexComponent } from './Student/index/index.component';
import { ConversationComponent } from './conversation/conversation.component';
import { ApplicationComponent } from './Student/application/application.component';
import { DashboardComponent } from './Student/dashboard/dashboard.component';

const routes: Routes = [
  {
    path: "student",
    component: DashboardComponent,
    children: [
      { path: 'profile', component: ProfileComponent },
      { path: '', component: IndexComponent },
      { path: 'chat', component: ConversationComponent },
      {path :'apply',component:ApplicationComponent , data: { breadcrumb: 'Application' }}
    ],
  },




  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: '', component: HomeComponent },
  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
