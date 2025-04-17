import { Component, OnInit } from '@angular/core';
import { UserService,User } from 'src/app/services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit{

  users: User[] = [];
  


  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        console.log('Fetched users:', users);
        this.users = users;
      },
      error: (err) => console.error('Error fetching users:', err)
    });
  }

  }




  

