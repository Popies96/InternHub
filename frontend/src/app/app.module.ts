import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminSidebarComponent } from './components/sidebars/admin-sidebar/admin-sidebar.component';
import { StudentSidebarComponent } from './components/sidebars/student-sidebar/student-sidebar.component';
import { StudentNavComponent } from './components/navbars/student-nav/student-nav.component';
import { AdminNavComponent } from './components/navbars/admin-nav/admin-nav.component';
import { ProfileComponent } from './profile/profile.component';
import { IndexComponent } from './Student/index/index.component';
import { IdeComponent } from './components/ide/ide.component';
import { RenduComponent } from './rendu/rendu.component';
import { ConversationComponent } from './conversation/conversation.component';
import { ApplicationComponent } from './Student/application/application.component';
import { DashboardComponent } from './Student/dashboard/dashboard.component';


@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    HomeComponent,
    LoginComponent,
    AdminSidebarComponent,
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
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
