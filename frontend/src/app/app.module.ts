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
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroSectionComponent } from './components/hero-section/hero-section.component';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { FooterComponent } from './components/footer/footer.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { LandingComponent } from './pages/landing/landing.component';
import { OnboardComponent } from './components/onboard/onboard.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { InternshipAiComponent } from './pages/internship-ai/internship-ai.component';
import { ChatappComponent } from './components/chatapp/chatapp.component';
import { UserComponent } from './components/user/user.component';
import { ConversationComponent } from './pages/conversation/conversation.component';
import { AddInternshipComponent } from './company/add-internship/add-internship.component';
import { ApplicationsComponent } from './company/applications/applications.component';
import { CompanyIndexComponent } from './company/company-index/company-index.component';
import { CompanyInternshipsComponent } from './company/company-internships/company-internships.component';
import { CompanyTasksComponent } from './company/company-tasks/company-tasks.component';
import { CompanydashboardComponent } from './company/companydashboard/companydashboard.component';
import { InternsComponent } from './company/interns/interns.component';
import { IdeComponent } from './components/ide/ide.component';
import { AdminNavComponent } from './components/navbars/admin-nav/admin-nav.component';
import { StudentNavComponent } from './components/navbars/student-nav/student-nav.component';
import { CompanySidebarComponent } from './components/sidebars/company-sidebar/company-sidebar.component';
import { StudentSidebarComponent } from './components/sidebars/student-sidebar/student-sidebar.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ApplicationComponent } from './Student/application/application.component';
import { CertificateComponent } from './Student/certificate/certificate.component';
import { CertificatesComponent } from './Student/certificates/certificates.component';
import { DashboardComponent } from './Student/dashboard/dashboard.component';
import { IndexComponent } from './Student/index/index.component';
import { InternshipsComponent } from './Student/internships/internships.component';
import { InterviewComponent } from './Student/interview/interview.component';
import { RenduComponent } from './Student/rendu/rendu.component';
import { SettingsComponent } from './Student/settings/settings.component';
import { TasksComponent } from './Student/tasks/tasks.component';
import { MonacoEditorModule } from '@materia-ui/ngx-monaco-editor';
import { ChatpopupComponent } from './components/chatpopup/chatpopup.component';
import { ForumComponent } from './components/forum/forum.component';
import { TopicComponent } from './components/topic/topic.component';
import { TopicDetailComponent } from './components/topic-detail/topic-detail.component';
import { CommentComponent } from './components/comment/comment.component';
@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    HomeComponent,
    LoginComponent,
    NavbarComponent,
    HeroSectionComponent,
    AboutComponent,
    ContactComponent,
    FooterComponent,
    SidebarComponent,
    LandingComponent,
    OnboardComponent,
    ForgotPasswordComponent,
    InternshipAiComponent,
    ChatappComponent,
    UserComponent,
    ConversationComponent,
    StudentSidebarComponent,
    StudentNavComponent,
    AdminNavComponent,
    ProfileComponent,
    IndexComponent,
    IdeComponent,
    RenduComponent,
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
    CompanyIndexComponent,
    AddInternshipComponent,
    InternsComponent,
    CompanySidebarComponent,
    CompanyTasksComponent,
    ApplicationsComponent,
    UnauthorizedComponent,
    ChatpopupComponent,
    ForumComponent,
    TopicComponent,
    TopicDetailComponent,
    CommentComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MonacoEditorModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
