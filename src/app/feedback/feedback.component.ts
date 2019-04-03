/* The script to control the user feedback application.
 * It includes an example of input validation.
 */
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})

export class FeedbackComponent implements OnInit {
  public success = false;
  public submitted = false;

  // the user must enter a pet and a password, and password must be >= 6 characters
  messageForm = new FormGroup({
    pet: new FormControl('', Validators.required),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    color: new FormControl('purple')
  });

  favoriteColorControl = this.messageForm.get('color');

  // the function gives a different error depending on which validation failed.
  getPasswordError() {
    return this.password().hasError('required') ? 'A password is required' :
           this.password().hasError('minlength') ? 'A password must be at least 6 characters' :
           'Something is wrong';
  }

  constructor() {
  }

   onSubmit() {
     this.submitted = true;
   }


  ngOnInit() {
    if (this.messageForm.invalid) {

    } else {
      this.success = true;
    }
  }

  // these helper functions return the individual FormContols so the
  //  html component can have access to then.
  password() {return this.messageForm.get('password'); }
  pet() {return this.messageForm.get('pet'); }
}
