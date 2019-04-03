/* An injectable service to provide the websocket communication to the server */
import { Injectable } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { Subscription, Subject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Response, Project, User } from './project';

/* The service is provided at the root level so there is one websocket for the
 * entire application
 */
@Injectable({
  providedIn: 'root'
})

export class CommService {

  readonly subject;   // a Subject is an Observable that can handle multicasting

  constructor() {
    this.subject = webSocket('ws://localhost:3000');

    /* This "generic" subscription is created to immediately open the websocket.
     * The error function is called if the websocket fails to open
     */
    this.subject.subscribe(
      msg => {},
      err => { console.log(err); },
      () => {}
    );
  }

  /* returns the Subject/Oberservable for the websocket */
  getConnection() {
    return this.subject;
  }

  /* Creates a subscription to the websocket.
   * It expects up to the three observable functions: next, error, and complete
   * Returns the Subscription object.
   */
  subscribe(next?: (value: {}) => void, err?: (error: any) => void, complete?: () => void): Subscription {
    return this.subject.subscribe(next, err, complete);
  }

  /* Creates a subscription that expects project data from the server over the websocket.
   * The data can come in as an array or a single project.
   * The function strips off the server response header and returns only the project(s).
   * The input functions are the next, error, and complete of observables.
   * Returns the Subscription object.
   */
  subscribeProjects(next?: (value: {}) => void, err?: (error: any) => void, complete?: () => void): Subscription {
    const projectNext = (value: Response) => {
      if (value.type === 'projectActionResponse') {
        if (value.result instanceof Array) {
          value.result.forEach(p => next(p));
          if (complete) {
            complete();
          }
        } else {
          next(value.result);
        }
      }
    };
    return this.subject.subscribe(projectNext, err, complete);
  }

  /* Creates a subscription that expects user data from the server over the websocket.
   * The data can come in as an array or a single user.
   * The function strips off the server response header and returns only the user(s).
   * The input functions are the next, error, and complete of observables.
   * Returns the Subscription object.
   */
  subscribeUsers(next?: (value: {}) => void, err?: (error: any) => void, complete?: () => void): Subscription {
    const userNext = (value: Response) => {
      if (value.type === 'userActionResponse') {
        if (value.result instanceof Array) {
          value.result.forEach(u => next(u));
          if (complete) {
            complete();
          }
        } else {
          next(value.result);
        }
      }
    };
    return this.subject.subscribe(userNext, err, complete);
  }

  /* Creates a subscription to the websocket that is looking for data on a particular project.
   * It filters the incoming websocket data for the desired project.
   * The function strips off the server response header and returns only the project.
   * The input is the id of the desired project and the next, error, and complete functions of observables.
   * Returns the Subscription object.
   */
  subscribeFilteredProject(id: number, next?: (value: {}) => void, err?: (error: any) => void, complete?: () => void): Subscription {
    const thisID = filter((resp: Response) => resp.type === 'projectActionResponse' &&
                   (resp.result as Project).id === id);
    const getByID = thisID(this.subject);
    const projectNext = (value: Response) => { next(value.result); };
    const subscription = getByID.subscribe(projectNext, err, complete);
    return subscription;
  }

  /* Creates a subscription to the websocket that is looking for data on a particular user.
   * It filters the incoming websocket data for the desired user.
   * The function strips off the server response header and returns only the user.
   * The input is the id of the desired project and the next, error, and complete functions of observables.
   * Returns the Subscription object.
   */
  subscribeFilteredUsers(id: number, next?: (value: {}) => void, err?: (error: any) => void, complete?: () => void): Subscription {
    const thisID = filter((resp: Response) => resp.type === 'userActionResponse' &&
                   (resp.result as Project).id === id);
    const getByID = thisID(this.subject);
    const userNext = (value: Response) => { next(value.result); };
    const subscription = getByID.subscribe(userNext, err, complete);
    return subscription;
  }

  /* Sends the input message to the server over the websocket */
  send(mes: object) {
    this.subject.next(mes);
  }
}
