import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './pages/signup/signup.component';
import { LoginComponent } from './pages/login/login.component';
import { LandingComponent } from './pages/landing/landing.component';
import { HomeComponent } from './pages/home/home.component';
import { OnboardComponent } from './components/onboard/onboard.component';
import { InternshipAiComponent } from './pages/internship-ai/internship-ai.component';


import { IndexComponent } from './Student/index/index.component';
import { ConversationComponent } from './pages/conversation/conversation.component';
import { ApplicationComponent } from './Student/application/application.component';
import { DashboardComponent } from './Student/dashboard/dashboard.component';

import { SettingsComponent } from './Student/settings/settings.component';
import { InternshipsComponent } from './Student/internships/internships.component';
import { TasksComponent } from './Student/tasks/tasks.component';
import { InterviewComponent } from './Student/interview/interview.component';
import { RenduComponent } from './Student/rendu/rendu.component';
import { CompanydashboardComponent } from './company/companydashboard/companydashboard.component';
import { CompanyInternshipsComponent } from './company/company-internships/company-internships.component';
import { CompanyIndexComponent } from './company/company-index/company-index.component';
import { AddInternshipComponent } from './company/add-internship/add-internship.component';
import { InternsComponent } from './company/interns/interns.component';
import { CompanyTasksComponent } from './company/company-tasks/company-tasks.component';
import { ApplicationsComponent } from './company/applications/applications.component';
import { AuthGuard } from './services/auth-guard.service';
import { InternshipsInfoComponent } from './Student/internships-info/internships-info.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { StudentCertificatesComponent } from './Student/student-certificates/student-certificates.component';
import { StudentDetailsCertifComponent } from './Student/student-details-certif/student-details-certif.component';
import { EditCertificatesComponent } from './company/certificate/edit-certificates/edit-certificates.component';
import { AddCertificatesComponent } from './company/certificate/add-certificates/add-certificates.component';
import { CertificatesComponent } from './company/certificate/certificates/certificates.component';
import { DetailsCertificatesComponent } from './company/certificate/details-certificates/details-certificates.component';

const routes: Routes = [

  {
    path: "student",
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_STUDENT'] },
    component: DashboardComponent,
    children: [
      { path: 'profile', component: ProfileComponent, data: { breadcrumb: 'Profile' } },
      { path: '', component: IndexComponent },
      { path: 'chat', component: ConversationComponent, data: { breadcrumb: 'Chat' } },
      { path: 'intern', component: InternshipsComponent, data: { breadcrumb: 'Internships' } },
      { path: 'apply', component: ApplicationComponent, data: { breadcrumb: 'Application' } },

      { path: 'settings', component: SettingsComponent, data: { breadcrumb: 'Settings' } },
      { path: 'tasks', component: TasksComponent, data: { breadcrumb: 'Tasks' } },
      { path: 'rendu', component: RenduComponent, data: { breadcrumb: 'Report' } },
      { path: 'intern-info', component: InternshipsInfoComponent, data: { breadcrumb: 'Internship Information' } },
    
      { path: 'certifStudent', component: StudentCertificatesComponent },

      { path: 'certifStudent/details/:id', component: StudentDetailsCertifComponent },
      { path: 'interview', component: InterviewComponent, data: { breadcrumb: 'Interviews' } }
    ],
  },

  {
    path: "company",
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_ENTERPRISE'] },
    component: CompanydashboardComponent,
    children: [
      { path: '', component: CompanyIndexComponent },
      { path: 'tasks', component: CompanyTasksComponent, data: { breadcrumb: 'Tasks Management' } },
      { path: 'chat', component: ConversationComponent, data: { breadcrumb: 'Chat' } },
      { path: 'intern', component: CompanyInternshipsComponent, data: { breadcrumb: 'Internships' } },
      { path: 'add_intern', component: AddInternshipComponent, data: { breadcrumb: 'Add Internship' } },
      { path: 'p', component: InternsComponent, data: { breadcrumb: 'Add Internship' } },
      { path: 'app', component: ApplicationsComponent, data: { breadcrumb: 'Applications' } },
      { path: 'certificates', component: CertificatesComponent },
      { path: 'certificates/add', component: AddCertificatesComponent },
      { path: 'certificates/edit/:id', component: EditCertificatesComponent },
      { path: 'certificates/details/:id', component: DetailsCertificatesComponent }
    ],
  },









  { path: '', component: HomeComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },

  { path: 'onboard', component: OnboardComponent },
  { path: 'dashboard', component: HomeComponent },
  { path: 'internshipAi', component: InternshipAiComponent },



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
