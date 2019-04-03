/* An injectable service to provide information to the user survey form.
 * Right now it provides the state and province abbreviations.
 */
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { STATES, PROVINCES } from './formdata';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor() { }

  getStates(): Observable<string[]> {
    return of(STATES);
  }

  getProvinces(): Observable<string[]> {
    return of(PROVINCES);
  }

}
