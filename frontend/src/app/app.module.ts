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

import { CertificatesComponent } from './certificate/certificates/certificates.component';
import { EditCertificatesComponent } from './certificate/edit-certificates/edit-certificates.component';
import { AddCertificatesComponent } from './certificate/add-certificates/add-certificates.component';
import { DetailsCertificatesComponent } from './certificate/details-certificates/details-certificates.component';


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

    CertificatesComponent,
    EditCertificatesComponent,
    AddCertificatesComponent,
    DetailsCertificatesComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ReactiveFormsModule,
    FormsModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
