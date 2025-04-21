import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
})
export class IndexComponent {
  @ViewChild('dashboardVideo') videoRef!: ElementRef<HTMLVideoElement>;

  ngAfterViewInit() {
    this.videoRef.nativeElement.volume = 0;
  }
}
