import { Injectable } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { Subscription, Subject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Response, Project, User } from './project';

@Injectable({
  providedIn: 'root'
})

export class CommService {

  readonly subject;

  constructor() {
    this.subject = webSocket('ws://localhost:3000');
    this.subject.subscribe();
  }

  getConnection() {
    return this.subject;
  }

  subscribe(next?: (value: {}) => void, err?: (error: any) => void, complete?: () => void): Subscription {
    return this.subject.subscribe(next, err, complete);
  }

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

  subscribeFilteredProject(id: number, next?: (value: {}) => void, err?: (error: any) => void, complete?: () => void): Subscription {
    const thisID = filter((resp: Response) => resp.type === 'projectActionResponse' &&
                   (resp.result as Project).id === id);
    const getByID = thisID(this.subject);
    const projectNext = (value: Response) => { next(value.result); };
    const subscription = getByID.subscribe(projectNext, err, complete);
    return subscription;
  }

  subscribeFilteredUsers(id: number, next?: (value: {}) => void, err?: (error: any) => void, complete?: () => void): Subscription {
    const thisID = filter((resp: Response) => resp.type === 'userActionResponse' &&
                   (resp.result as Project).id === id);
    const getByID = thisID(this.subject);
    const userNext = (value: Response) => { next(value.result); };
    const subscription = getByID.subscribe(userNext, err, complete);
    return subscription;
  }

  send(mes: object) {
    this.subject.next(mes);
  }
}
