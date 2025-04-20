import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from '../app/pages/signup/signup.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { IndexComponent } from './Student/index/index.component';
import { ConversationComponent } from './pages/conversation/conversation.component';
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
import { CompanyInternshipsComponent } from './company/company-internships/company-internships.component';
import { CompanyIndexComponent } from './company/company-index/company-index.component';
import { AddInternshipComponent } from './company/add-internship/add-internship.component';
import { InternsComponent } from './company/interns/interns.component';
import { CompanyTasksComponent } from './company/company-tasks/company-tasks.component';
import { ApplicationsComponent } from './company/applications/applications.component';
import { AuthGuard } from './services/auth-guard.service';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { MsgPopupComponent } from './components/msg-popup/msg-popup.component';
import { InternshipsInfoComponent } from './Student/internships-info/internships-info.component';

const routes: Routes = [
  {
    path: "student",
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_STUDENT'] },
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
      {path : 'intern-info' , component:InternshipsInfoComponent , data: { breadcrumb: 'Internship Information' }},
      {path : 'certif' , 
        children: [
          {path: '', component: CertificatesComponent, data: { breadcrumb: 'Certificates' }},
          {path: 'certif_detail', component: CertificateComponent, data: { breadcrumb: 'Certificate ' }}
        ]
      },
      {path : 'interview' , component:InterviewComponent , data: { breadcrumb: 'Interviews' } }
    ],
  },

  {
    path: "company",
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_ENTERPRISE'] },
    component: CompanydashboardComponent,
    children: [
      {path: '', component: CompanyIndexComponent },
      {path: 'tasks', component: CompanyTasksComponent  , data: { breadcrumb: 'Tasks Management' }},
      {path: 'chat', component: ConversationComponent  , data: { breadcrumb: 'Chat' }},
      {path: 'intern', component: CompanyInternshipsComponent , data: { breadcrumb: 'Internships' }},
      {path: 'add_intern', component: AddInternshipComponent , data: { breadcrumb: 'Add Internship' }},
      {path: 'p', component: InternsComponent , data: { breadcrumb: 'Add Internship' }},
      {path: 'app', component: ApplicationsComponent , data: { breadcrumb: 'Applications' }}
    ],
  },
  {path: 'msg', component: MsgPopupComponent  , data: { roles: [] }},
  { path: 'signup', component: SignupComponent , data: { roles: [] }},
  { path: 'login', component: LoginComponent  , data: { roles: [] }},
  { path: '', component: HomeComponent, data: { roles: [] }},
  { path: 'unauthorized', component: UnauthorizedComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
