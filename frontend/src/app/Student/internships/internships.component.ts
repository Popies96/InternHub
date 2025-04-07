import { Component } from '@angular/core';

@Component({
  selector: 'app-internships',
  templateUrl: './internships.component.html',
  styleUrls: ['./internships.component.css']
})
export class InternshipsComponent {
  toggleDropdown() {
    const dropdown = document.getElementById('dropdown');
    dropdown?.classList.toggle('hidden');
  }
}
