import { Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent {
  Name = 'Alex';
  LastName = 'mitnick';
  Email = 'alex@gmail.com';
  Phone = '52854965';
}
