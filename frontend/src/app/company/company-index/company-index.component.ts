import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-company-index',
  templateUrl: './company-index.component.html',
  styleUrls: ['./company-index.component.css']
})
export class CompanyIndexComponent {
 @ViewChild('dashboardVideo') videoRef!: ElementRef<HTMLVideoElement>;

  ngAfterViewInit() {
    this.videoRef.nativeElement.volume = 0;
  }
}
