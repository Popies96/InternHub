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
import { IdeComponent } from './components/ide/ide.component';
import { SettingsComponent } from './Student/settings/settings.component';
import { InternshipsComponent } from './Student/internships/internships.component';
import { TasksComponent } from './Student/tasks/tasks.component';

const routes: Routes = [
  {
    path: "student",
    component: DashboardComponent,
    children: [
      {path: 'profile', component: ProfileComponent  , data: { breadcrumb: 'Profile' }},
      {path: '', component: IndexComponent },
      {path: 'chat', component: ConversationComponent  , data: { breadcrumb: 'Chat' }},
      {path :'intern' , component:InternshipsComponent, data: { breadcrumb: 'Internships' }} , 
      {path :'apply',component:ApplicationComponent , data: { breadcrumb: 'Application' }},
      {path :'ide' , component:IdeComponent , data: { breadcrumb: 'IDE' } }, 
      {path :'settings' , component:SettingsComponent , data: { breadcrumb: 'Settings' }}, 
      {path :'tasks' , component:TasksComponent , data: { breadcrumb: 'Tasks' }},

     
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
