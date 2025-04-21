import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InternshipAi } from 'src/app/models/models ';
import { InternshipAiService } from 'src/app/services/internship-ai.service';

@Component({
  selector: 'app-internship-ai-details',
  templateUrl: './internship-ai-details.component.html',
  styleUrls: ['./internship-ai-details.component.css'],
})
export class InternshipAiDetailsComponent implements OnInit {
  internshipId : number | null = null;
  internship!: InternshipAi ;;
  constructor(
    private router: Router,
    private internshipAiService: InternshipAiService,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.fetchInternshipAi();
  }

  fetchInternshipAi(): void {
    this.internshipId = this.route.snapshot.params['id'];
    if (this.internshipId !== null) {
      this.internshipAiService.getInternshipAiById(this.internshipId).subscribe(
        (data) => {
          this.internship = data;
          
        },
        (error) => {
          console.error('Error fetching internshipAi:', error);
          
        }
      );
    }
  }
}
