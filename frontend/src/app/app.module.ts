import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignupComponent } from './pages/signup/signup.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { LandingComponent } from './pages/landing/landing.component';
import { OnboardComponent } from './components/onboard/onboard.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { InternshipAiComponent } from './pages/Student/internshipAi/internship-ai/internship-ai.component';
import { AdminNavComponent } from './components/navbars/admin-nav/admin-nav.component';
import { StudentNavComponent } from './components/navbars/student-nav/student-nav.component';
import { AdminSidebarComponent } from './components/sidebars/admin-sidebar/admin-sidebar.component';
import { StudentSidebarComponent } from './components/sidebars/student-sidebar/student-sidebar.component';
import { DashboardComponent } from './pages/Student/dashboard/dashboard.component';
import { ApplicationComponent } from './pages/Student/application/application.component';
import { IndexComponent } from './pages/Student/index/index.component';
import { InternshipsComponent } from './pages/Student/internships/internships.component';
import { InterviewComponent } from './pages/Student/interview/interview.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { InternshipAiListComponent } from './pages/Student/internshipAi/internship-ai-list/internship-ai-list.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { TaskAiWorkflowComponent } from './pages/Student/internshipAi/task-ai-workflow/task-ai-workflow.component';
import { TaskAiSidebarComponent } from './components/sidebars/task-ai-sidebar/task-ai-sidebar.component';
import { TaskAiResponseComponent } from './pages/Student/internshipAi/task-ai-response/task-ai-response.component';
import { InternshipAiDetailsComponent } from './pages/Student/internshipAi/internship-ai-details/internship-ai-details.component';
import { IdeComponent } from './components/ide/ide.component';
import { MonacoEditorModule, MONACO_PATH } from '@materia-ui/ngx-monaco-editor';
import { ChatappComponent } from './components/chatapp/chatapp.component';
import { ChatpopupComponent } from './components/chatpopup/chatpopup.component';
import { ConversationComponent } from './pages/conversation/conversation.component';
import { CompanySidebarComponent } from './components/sidebars/company-sidebar/company-sidebar.component';
import { TopicComponent } from './components/topic/topic.component';
import { TopicDetailComponent } from './components/topic-detail/topic-detail.component';
import { CompanydashboardComponent } from './pages/company/companydashboard/companydashboard.component';
import { CompanyIndexComponent } from './pages/company/company-index/company-index.component';
import { ForumComponent } from './components/forum/forum.component';
import { StudentCertificatesComponent } from './pages/Student/student-certificates/student-certificates.component';
import { StudentDetailsCertifComponent } from './pages/Student/student-details-certif/student-details-certif.component';
import { AddCertificatesComponent } from './pages/company/certificate/add-certificates/add-certificates.component';
import { AiCertificateAssistantComponent } from './components/ai-certificate-assistant/ai-certificate-assistant.component';
import { DetailsCertificatesComponent } from './pages/company/certificate/details-certificates/details-certificates.component';
import { EditCertificatesComponent } from './pages/company/certificate/edit-certificates/edit-certificates.component';
import { CertificatesComponent } from './pages/company/certificate/certificates/certificates.component';
import { ProfileComponent } from './pages/profile/profile.component';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    HomeComponent,
    LoginComponent,

    LandingComponent,
    OnboardComponent,
    ForgotPasswordComponent,
    InternshipAiComponent,
    AdminNavComponent,
    StudentNavComponent,
    AdminSidebarComponent,
    StudentSidebarComponent,
    DashboardComponent,
    ApplicationComponent,
    IndexComponent,
    InternshipsComponent,
    InterviewComponent,
    SettingsComponent,
    InternshipAiListComponent,
    UnauthorizedComponent,
    TaskAiWorkflowComponent,
    TaskAiSidebarComponent,
    TaskAiResponseComponent,
    InternshipAiDetailsComponent,
    IdeComponent,
    ChatappComponent,
    ChatpopupComponent,
    ConversationComponent,
    CompanySidebarComponent,
    TopicComponent,
    TopicDetailComponent,
    CompanydashboardComponent,
    CompanyIndexComponent,
    ForumComponent,
    StudentCertificatesComponent,
    StudentDetailsCertifComponent,
    AddCertificatesComponent,
    AiCertificateAssistantComponent,
    DetailsCertificatesComponent,
    EditCertificatesComponent,
    CertificatesComponent,
    ProfileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MonacoEditorModule,
  ],
  providers: [
    {
      provide: MONACO_PATH,
      useValue: 'https://unpkg.com/monaco-editor@0.20.0/min/vs',
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
