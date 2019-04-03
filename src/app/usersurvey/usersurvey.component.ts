/* The script to control the form for entering user name and address */
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { FormService } from '../form.service';


@Component({
  selector: 'app-usersurvey',
  templateUrl: './usersurvey.component.html',
  styleUrls: ['./usersurvey.component.css']
})
export class UsersurveyComponent implements OnInit {

  /* A list of state/province abbreviations, and the entered country */
  public states: string[];
  public myCountry: string;

  /* Organizes the form used to enter data */
  userProfile = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    address: new FormGroup({
      street: new FormControl(''),
      city: new FormControl(''),
      state: new FormControl(''),
      country: new FormControl('United States'),
    }),
  });

  /* This component uses the FormService to get data */
  constructor(private formService: FormService) {
  }

  // functions to get the states and provices from the service
  getStates(): void {
    this.formService.getStates()
        .subscribe(states => this.states = states);
  }

  getProvinces(): void {
    this.formService.getProvinces()
        .subscribe(provinces => this.states = provinces);
  }


  // register for when the country changes to get the appropriate state/provice abbreviations.
  ngOnInit() {
    this.getStates();
    const val: FormControl = this.userProfile.get('address.country') as FormControl;
    const observ: Observable<any> = val.valueChanges;
    observ.subscribe(c => (c === 'Canada') ? this.getProvinces() : this.getStates());
  }

}
