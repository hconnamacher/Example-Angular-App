/* The typescript to control the display of an individual project */

import { Component, OnInit, Input } from '@angular/core';
import { ProjectService } from '../project.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Project, User } from '../../project';

/* The "providers" shows that each project display will have its own ProjectService */
@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css'],
  providers: [ ProjectService ]
})

export class ProjectComponent implements OnInit {

  /* displayAll records if we are showing all project info or just the header.
   * project is the project information.  This data can be passed on on component creation.
   * user is the info for the user currently assigned to the project
   */
  displayAll = false;
  @Input() project: Project;
  user: User | undefined = undefined;

  /* These are the form fields used for display and data entry */
  projectForm: FormGroup;
  idField: FormControl;
  userField;
  nameField;
  deadlineField;

  /* The project uses a service to provide the project/user info from the server */
  constructor(private projectService: ProjectService) { }

  ngOnInit() {
    /* get the project info and use it to intialize the component form */
    const userID = this.project ? this.project.userId : '';
    const name = this.project ? this.project.name : '';
    const deadline = this.project ? this.project.deadline : '';
    this.projectForm = new FormGroup({
       userField : new FormControl(`${userID}`),
       nameField : new FormControl(name),
       deadlineField : new FormControl(`${deadline}`)
    });

    /* Get the FormControls for each input and store in a field so that
     * the component can have access to the FormControls
     */
    this.userField = this.projectForm.get('userField');
    this.nameField = this.projectForm.get('nameField');
    this.deadlineField = this.projectForm.get('deadlineField');

    this.projectService.project = this.project;

    /* If the userField changes, request info about the new user entered. */
    this.userField.valueChanges.subscribe(
      (value) => { const id = Number.parseInt(value, 10);
                   this.projectService.project.userId = id;
                   this.user = undefined;
                   this.projectService.getProjectUser(id);
                 }
    );

    /* If the nameField changes, record the change */
    this.nameField.valueChanges.subscribe(
      (value) => { this.projectService.project.name = value; }
    );

    /* Subscribe to the ProjectService to get updated if new project info arrives */
    this.projectService.projectEmitter.subscribe(
      (p) => { this.project = p;
               this.nameField.setValue(p.name);
               this.userField.setValue(p.userId);
               this.deadlineField.setValue(p.deadline); }
    );

    /* Subscribe to the ProjectService to get updated if new user info arrives */
    this.projectService.userEmitter.subscribe(
      (u) => { this.user = u; }
    );

    /* If there is a project, ask the ProjectService to get info on the project's user */
    if (this.project) {
      this.projectService.getProjectUser(this.project.userId);
    }
  }

  /* Toggle between showing all project info and just the header. */
  toggleDisplay() {
    this.displayAll = !this.displayAll;
  }

  /* Save the project changes. Not yet implemented. */
  editProject() {
  }

  /* Restore the project to its current server values. */
  resetProject() {
    this.projectService.restore();
  }
}
