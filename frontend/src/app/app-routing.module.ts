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
import { CertificateComponent } from './Student/certificate/certificate.component';
import { InterviewComponent } from './Student/interview/interview.component';
import { CertificatesComponent } from './Student/certificates/certificates.component';
import { RenduComponent } from './Student/rendu/rendu.component';
import { CompanydashboardComponent } from './company/companydashboard/companydashboard.component';

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
      {path : 'rendu' , component:RenduComponent , data: { breadcrumb: 'Report' }},
      {path : 'certif' , 
        children: [
          {path: '', component: CertificatesComponent, data: { breadcrumb: 'Certificates' }},
          {path: 'certif_detail', component: CertificateComponent, data: { breadcrumb: 'Certificate' }}
        ]
      },
      {path : 'interview' , component:InterviewComponent , data: { breadcrumb: 'Interviews' } }
    ],
  },


  {
    path: "company",
    component: CompanydashboardComponent,
    children: [
      {path: '', component: CompanydashboardComponent },
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
