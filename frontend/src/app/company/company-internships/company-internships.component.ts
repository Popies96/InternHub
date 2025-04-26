import { Component } from '@angular/core';
import {InternshipsComponent} from "../../Student/internships/internships.component";

@Component({
  selector: 'app-company-internships',
  templateUrl: './company-internships.component.html',
  styleUrls: ['./company-internships.component.css']
})
export class CompanyInternshipsComponent {

    protected readonly InternshipsComponent = InternshipsComponent;
}
