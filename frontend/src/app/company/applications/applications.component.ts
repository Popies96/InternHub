import { Component } from '@angular/core';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.css']
})
export class ApplicationsComponent {

  isInt = false;
  isStatus = false;
  isDepart = false;
  isType = false;
  toggleInt() {
    this.isInt = !this.isInt;
    this.isStatus = false;
    this.isDepart = false;
    this.isType = false
  }

  toggleStatus() {
    this.isStatus = !this.isStatus;
    this.isInt = false;
    this.isDepart = false;
    this.isType = false
  }

  toggleDepart() {
    this.isDepart = !this.isDepart;
    this.isInt = false;
    this.isStatus = false;
    this.isType = false
  }


  toggleType() {
    this.isDepart = false;
    this.isInt = false;
    this.isStatus = false;
    this.isType = !this.isType;
  }
}
