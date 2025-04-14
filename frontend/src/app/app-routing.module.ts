import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './pages/signup/signup.component';
import { LoginComponent } from './pages/login/login.component';
import { LandingComponent } from './pages/landing/landing.component';
import { HomeComponent } from './pages/home/home.component';
import { OnboardComponent } from './components/onboard/onboard.component';
import { InternshipAiComponent } from './pages/internship-ai/internship-ai.component';

import { CertificatesComponent } from './certificate/certificates/certificates.component';
import { AddCertificatesComponent } from './certificate/add-certificates/add-certificates.component';
import { EditCertificatesComponent } from './certificate/edit-certificates/edit-certificates.component';
import { DetailsCertificatesComponent } from './certificate/details-certificates/details-certificates.component';


const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },

  { path: 'onboard', component: OnboardComponent },
  { path: 'dashboard', component: HomeComponent },
  { path: 'internshipAi', component: InternshipAiComponent },

  { path: 'certificates', component: CertificatesComponent },
  { path: 'certificates/add', component: AddCertificatesComponent },
  { path: 'certificates/edit/:id', component: EditCertificatesComponent },
  { path: 'certificates/details/:id', component: DetailsCertificatesComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
