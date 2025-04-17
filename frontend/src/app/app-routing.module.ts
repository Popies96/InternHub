import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './pages/signup/signup.component';
import { LoginComponent } from './pages/login/login.component';
import { LandingComponent } from './pages/landing/landing.component';
import { HomeComponent } from './pages/home/home.component';
import { OnboardComponent } from './components/onboard/onboard.component';
import { InternshipAiComponent } from './pages/internship-ai/internship-ai.component';
import { ChatappComponent } from './components/chatapp/chatapp.component';
import { UserComponent } from './components/user/user.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'onboard', component: OnboardComponent },
  { path: 'dashboard', component: HomeComponent },
  { path: 'internshipAi', component: InternshipAiComponent },
  {path:'chat',component:ChatappComponent},
  {path:'users',component:UserComponent}


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
