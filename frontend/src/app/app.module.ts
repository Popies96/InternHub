import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignupComponent } from '../app/pages/signup/signup.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StudentSidebarComponent } from './components/sidebars/student-sidebar/student-sidebar.component';
import { StudentNavComponent } from './components/navbars/student-nav/student-nav.component';
import { AdminNavComponent } from './components/navbars/admin-nav/admin-nav.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { IndexComponent } from './Student/index/index.component';
import { IdeComponent } from './components/ide/ide.component';
import { RenduComponent } from './Student/rendu/rendu.component';
import { ConversationComponent } from './pages/conversation/conversation.component';
import { ApplicationComponent } from './Student/application/application.component';
import { DashboardComponent } from './Student/dashboard/dashboard.component';
import { MonacoEditorModule, MONACO_PATH } from '@materia-ui/ngx-monaco-editor';
import { SettingsComponent } from './Student/settings/settings.component';
import { InternshipsComponent } from './Student/internships/internships.component';
import { TasksComponent } from './Student/tasks/tasks.component';
import { CertificateComponent } from './Student/certificate/certificate.component';
import { InterviewComponent } from './Student/interview/interview.component';
import { CertificatesComponent } from './Student/certificates/certificates.component';
import { CompanydashboardComponent } from './company/companydashboard/companydashboard.component';
import { CompanyInternshipsComponent } from './company/company-internships/company-internships.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { OnboardComponent } from './components/onboard/onboard.component';
import { CompanyIndexComponent } from './company/company-index/company-index.component';
import { AddInternshipComponent } from './company/add-internship/add-internship.component';
import { InternsComponent } from './company/interns/interns.component';
import { CompanySidebarComponent } from './components/sidebars/company-sidebar/company-sidebar.component';
import { CompanyTasksComponent } from './company/company-tasks/company-tasks.component';
import { ApplicationsComponent } from './company/applications/applications.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { MsgPopupComponent } from './components/msg-popup/msg-popup.component';
import { InternshipsInfoComponent } from './Student/internships-info/internships-info.component';



@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    HomeComponent,
    LoginComponent,
    StudentSidebarComponent,
    StudentNavComponent,
    AdminNavComponent,
    ProfileComponent,
    IndexComponent,
    IdeComponent,
    RenduComponent,
    ConversationComponent,
    ApplicationComponent,
    DashboardComponent,
    SettingsComponent,
    InternshipsComponent,
    TasksComponent,
    CertificateComponent,
    InterviewComponent,
    CertificatesComponent,
    CompanydashboardComponent,
    CompanyInternshipsComponent,
    ForgotPasswordComponent,
    OnboardComponent,
    CompanyIndexComponent,
    AddInternshipComponent,
    InternsComponent,
    CompanySidebarComponent,
    CompanyTasksComponent,
    ApplicationsComponent,
    UnauthorizedComponent,
    MsgPopupComponent,
    InternshipsInfoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MonacoEditorModule 
  ],
  providers: [{
		provide: MONACO_PATH,
		useValue: 'https://unpkg.com/monaco-editor@0.20.0/min/vs'
	}

],
  bootstrap: [AppComponent]
})
export class AppModule { }
