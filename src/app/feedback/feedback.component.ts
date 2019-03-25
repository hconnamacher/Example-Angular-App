import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { getFirstTemplatePass } from '@angular/core/src/render3/state';
import { parseTemplate } from '@angular/compiler';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})

export class FeedbackComponent implements OnInit {
  // public messageForm: FormGroup;
  public success = false;
  public submitted = false;

  favoriteColorControl = new FormControl('purple');

  // pet = new FormControl('');
  messageForm = new FormGroup({
    pet: new FormControl('', Validators.required),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  constructor() {
  }

  /*
  constructor(private formBuilder: FormBuilder) {
    this.messageForm = this.formBuilder.group({
      pets : ['', Validators.required],
      password : ['', Validators.required]
    });
   }
   */

   onSubmit() {
     this.submitted = true;
   }


  ngOnInit() {
    if (this.messageForm.invalid) {

    } else {
      this.success = true;
    }
  }

  password() {return this.messageForm.get('password'); }
  pet() {return this.messageForm.get('pet'); }
}
