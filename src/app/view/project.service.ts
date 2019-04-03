/* An injectable service to provide project and user data.
 * The data comes from the CommService that controls the websocket.
 */
import { Injectable } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { User, Project, Response } from '../project';
import { CommService } from '../comm.service';

/* This indicates the service is injectable, but does not indicate
 * who provides the service.  We will have a separate service for each project.
 */
@Injectable()

export class ProjectService {

  /* Records the current project and the user for the project.
   * Also has emitters that will send info on the project or user when
   *  new data arrives from the server.
   */
  currentProject: Project;
  projectUser: User;
  projectEmitter: EventEmitter<Project> = new EventEmitter<Project>(true);
  userEmitter: EventEmitter<User> = new EventEmitter<User>(true);

  /* This application uses the websocket defined in CommService */
  constructor(private commService: CommService) { }

  /* Changes the current project, and requests the user info for the project */
  set project(p: Project) {
    this.currentProject = p;
    this.getProjectUser(p.userId);
  }

  /* Returns the current project */
  get project(): Project {
    return this.currentProject;
  }

  /* Sends a request to the server to get info on a particular user.
   * Once the user arrives, it uses the emitter to send the user info to
   *  everyone waiting for it.
   */
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

  /* To remove all changes to a project.  It sends a request to the server for the project info.
   * Once the project info arrives, it uses the emitter to send the project info to all who requested it.
   */
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
