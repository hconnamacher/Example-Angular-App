import { Injectable } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { User, Project, Response } from '../project';
import { CommService } from '../comm.service';

@Injectable()

export class ProjectService {

  currentProject: Project;
  projectUser: User;
  projectEmitter: EventEmitter<Project> = new EventEmitter<Project>(true);
  userEmitter: EventEmitter<User> = new EventEmitter<User>(true);

  constructor(private commService: CommService) { }

  set project(p: Project) {
    this.currentProject = p;
    this.getProjectUser(p.userId);
  }

  get project(): Project {
    return this.currentProject;
  }

  getProjectUser(id: number) {
    const subscription = this.commService.subscribeFilteredUsers(
      id,
      (u: User) => {this.projectUser = u;
                    this.userEmitter.emit(u);
                    if (subscription) {
                        subscription.unsubscribe();
                       } }
    );
    this.commService.send({entityType: 'user', userId: id, action: 'getById'});
  }

  restore() {
    const subscription = this.commService.subscribeFilteredProject(
      this.project.id,
      (p: Project) => {this.project = p;
                       this.projectEmitter.emit(p);
                       if (subscription) {
                         subscription.unsubscribe();
                       } }
    );
    this.commService.send({entityType: 'project', projectId: this.project.id, action: 'getById'});
  }
}
