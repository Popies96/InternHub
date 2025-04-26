import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { InterviewService } from 'src/app/services/interview.service';
import * as L from 'leaflet';


@Component({
  selector: 'app-interview-scheduler',
  templateUrl: './interview-scheduler.component.html',
  styleUrls: ['./interview-scheduler.component.css']
})
export class InterviewSchedulerComponent implements OnInit {
  form: FormGroup;
  mode: string = 'ONLINE';
  applicationId?: number ;

  constructor(
    private fb: FormBuilder, 
    private interviewService: InterviewService,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      applicationId: [{ value: '', disabled: true }, Validators.required],
      scheduledDate: ['', Validators.required],
      mode: ['ONLINE', Validators.required],
      location: [''],
      notes: ['']
    });
  }
  

  ngOnInit(): void {
    // Extract the applicationId from the route
    this.route.paramMap.subscribe(params => {
      const id = params.get('applicationId');
      if (id !== null) {
        this.applicationId = +id;
        this.form.get('applicationId')?.setValue(this.applicationId);
      } else {
        console.error('I cannot get the application to schedule an interview');
      }
    });
  }

  onModeChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.mode = select.value;
  
    if (this.mode === 'ONLINE') {
      this.form.get('location')?.setValue('');
      this.form.get('location')?.clearValidators();
    } else {
      this.form.get('location')?.setValidators([Validators.required]);
      setTimeout(() => this.initMap(), 0); // Initialize map after view updates
    }
  
    this.form.get('location')?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.form.valid) {
      const formData = { ...this.form.getRawValue() };
  
      this.interviewService.createInterview(formData).subscribe({
        next: () => alert('Interview scheduled successfully'),
        error: err => alert('Error: ' + err.message)
      });
    }
  }
  map: L.Map | undefined;

initMap() {
  if (this.map) {
    this.map.remove(); // Remove previous map if exists
  }
  delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'assets/marker-icon-2x.png',
  iconUrl: 'assets/marker-icon.png',
  shadowUrl: 'assets/marker-shadow.png',
});

  this.map = L.map('map').setView([36.8065, 10.1815], 13); // Default center (Tunis for example)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(this.map);

  const marker = L.marker([36.8065, 10.1815], { draggable: true }).addTo(this.map);

  // When user clicks on map
  this.map.on('click', (e: L.LeafletMouseEvent) => {
    const { lat, lng } = e.latlng;
    marker.setLatLng([lat, lng]);
    this.reverseGeocode(lat, lng);
  });
  
  marker.on('dragend', () => {
    const { lat, lng } = marker.getLatLng();
    this.reverseGeocode(lat, lng);
  });
}
reverseGeocode(lat: number, lng: number) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const address = data.display_name || `${lat}, ${lng}`;
      this.form.get('location')?.setValue(address);
    })
    .catch(error => {
      console.error('Reverse geocoding error:', error);
      this.form.get('location')?.setValue(`${lat}, ${lng}`);
    });
}
}
