import { Component } from '@angular/core';
import { InternshipService } from 'src/app/services/internship.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(private internshipService: InternshipService) { 
    
  }
  ngOnInit(){
     this.internships();
  }

  
internships (){
  this.internshipService.getInternshipByEnterprise().subscribe(
      (data) => {
        console.log(data);
      },
      (error) => {
        console.log(error);
      })
}
}
