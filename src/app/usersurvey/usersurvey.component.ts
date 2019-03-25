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

  public states: string[];
  public myCountry: string;

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

  constructor(private formService: FormService) {
  }

  // functions to get the states and provices
  getStates(): void {
    this.formService.getStates()
        .subscribe(states => this.states = states);
  }

  getProvinces(): void {
    this.formService.getProvinces()
        .subscribe(provinces => this.states = provinces);
  }


  // register for when the country changes.
  ngOnInit() {
    this.getStates();
    const val: FormControl = this.userProfile.get('address.country') as FormControl;
    const observ: Observable<any> = val.valueChanges;
    observ.subscribe(c => (c === 'Canada') ? this.getProvinces() : this.getStates());
  }

}
