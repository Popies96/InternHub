import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './pages/signup/signup.component';
import { LoginComponent } from './pages/login/login.component';
import { LandingComponent } from './pages/landing/landing.component';
import { HomeComponent } from './pages/home/home.component';
import { OnboardComponent } from './components/onboard/onboard.component';
import { InternshipAiComponent } from './pages/Student/internshipAi/internship-ai/internship-ai.component';
import { DashboardComponent } from './pages/Student/dashboard/dashboard.component';
import { IndexComponent } from './pages/Student/index/index.component';
import { InternshipsComponent } from './pages/Student/internships/internships.component';
import { ApplicationComponent } from './pages/Student/application/application.component';
import { SettingsComponent } from './pages/Student/settings/settings.component';
import { InterviewComponent } from './pages/Student/interview/interview.component';
import { AuthGuardService } from './services/auth-guard.service';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { InternshipAiListComponent } from './pages/Student/internshipAi/internship-ai-list/internship-ai-list.component';
import { TaskAiWorkflowComponent } from './pages/Student/internshipAi/task-ai-workflow/task-ai-workflow.component';
import { TaskAiResponseComponent } from './pages/Student/internshipAi/task-ai-response/task-ai-response.component';
import { InternshipAiDetailsComponent } from './pages/Student/internshipAi/internship-ai-details/internship-ai-details.component';
import { ChatpopupComponent } from './components/chatpopup/chatpopup.component';
import { ConversationComponent } from './pages/conversation/conversation.component';
import { CompanydashboardComponent } from './pages/company/companydashboard/companydashboard.component';
import { CompanyIndexComponent } from './pages/company/company-index/company-index.component';
import { TopicComponent } from './components/topic/topic.component';
import { TopicDetailComponent } from './components/topic-detail/topic-detail.component';
import { StudentCertificatesComponent } from './pages/Student/student-certificates/student-certificates.component';
import { StudentDetailsCertifComponent } from './pages/Student/student-details-certif/student-details-certif.component';
import { CertificatesComponent } from './pages/company/certificate/certificates/certificates.component';
import { AddCertificatesComponent } from './pages/company/certificate/add-certificates/add-certificates.component';
import { EditCertificatesComponent } from './pages/company/certificate/edit-certificates/edit-certificates.component';
import { DetailsCertificatesComponent } from './pages/company/certificate/details-certificates/details-certificates.component';

const routes: Routes = [
  {
    path: 'student',
    canActivate: [AuthGuardService],
    data: { roles: ['ROLE_STUDENT'] },
    component: DashboardComponent,
    children: [
      // {
      //   path: 'profile',
      //   component: ProfileComponent,
      //   data: { breadcrumb: 'Profile' },
      // },
      { path: '', component: IndexComponent },
      {
        path: 'intern',
        component: InternshipsComponent,
        data: { breadcrumb: 'Internships' },
      },
      {
        path: 'internshipAi',
        children: [
          {
            path: '',
            component: InternshipAiListComponent,
            data: { breadcrumb: 'AI Internships' },
          },
          {
            path: 'create',
            component: InternshipAiComponent,
            data: { breadcrumb: 'Create Internship' },
          },
        ],
      },
      {
        path: 'apply',
        component: ApplicationComponent,
        data: { breadcrumb: 'Application' },
      },
      {
        path: 'settings',
        component: SettingsComponent,
        data: { breadcrumb: 'Settings' },
      },
      {
        path: 'chatpopup',
        component: ChatpopupComponent,
        data: { breadcrumb: 'Chat' },
      },
      {
        path: 'chat',
        component: ConversationComponent,
        data: { breadcrumb: 'Chat' },
      },
      {
        path: 'topic',
        component: TopicComponent,
        data: { breadcrumb: 'forum' },
      },
      { path: 'topics/:id', component: TopicDetailComponent },
      { path: 'certifStudent', component: StudentCertificatesComponent },

      {
        path: 'certifStudent/details/:id',
        component: StudentDetailsCertifComponent,
      },
      {
        path: 'interview',
        component: InterviewComponent,
        data: { breadcrumb: 'Interviews' },
      },
    ],
  },
  {
    path: 'company',
    canActivate: [AuthGuardService],
    data: { roles: ['ROLE_ENTERPRISE'] },
    component: CompanydashboardComponent,
    children: [
      { path: '', component: CompanyIndexComponent },
      {
        path: 'chat',
        component: ConversationComponent,
        data: { breadcrumb: 'Chat' },
      },
      {
        path: 'chatpopup',
        component: ChatpopupComponent,
        data: { breadcrumb: 'Chat' },
      },
      { path: 'certificates', component: CertificatesComponent },
      { path: 'certificates/add', component: AddCertificatesComponent },
      { path: 'certificates/edit/:id', component: EditCertificatesComponent },
      {
        path: 'certificates/details/:id',
        component: DetailsCertificatesComponent,
      },
    ],
  },

  { path: '', component: LandingComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'onboard', component: OnboardComponent },
  { path: 'dashboard', component: HomeComponent },
  {
    path: 'workflow/:id',
    component: TaskAiWorkflowComponent,
    data: { breadcrumb: 'workflow' },
    children: [
      {
        path: '',
        component: InternshipAiDetailsComponent,
        data: { breadcrumb: 'Ai internship details' },
      },
      {
        path: 'task/:taskId',
        component: TaskAiResponseComponent,
        data: { breadcrumb: 'Tasks' },
      },
    ],
  },
  { path: 'unauthorized', component: UnauthorizedComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
