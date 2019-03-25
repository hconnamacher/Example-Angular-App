import { Component, OnInit, Input } from '@angular/core';
import { ProjectService } from '../project.service';
import { FormControl } from '@angular/forms';
import { Project, User } from '../../project';
import { SELECT_VALUE_ACCESSOR } from '@angular/forms/src/directives/select_control_value_accessor';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css'],
  providers: [ ProjectService ]
})

export class ProjectComponent implements OnInit {

  displayAll = false;
  @Input() project: Project;
  user: User | undefined = undefined;

  idField: FormControl;
  userField: FormControl;
  nameField: FormControl;
  deadlineField: FormControl;

  constructor(private projectService: ProjectService) { }

  ngOnInit() {
    this.userField = new FormControl(`${this.project.userId}`);
    this.nameField = new FormControl(this.project.name);
    this.deadlineField = new FormControl(`${this.project.deadline}`);

    this.projectService.project = this.project;
    this.userField.valueChanges.subscribe(
      (value) => { const id = Number.parseInt(value, 10);
                   this.projectService.project.userId = id;
                   this.user = undefined;
                   this.projectService.getProjectUser(id);
                 }
    );
    this.nameField.valueChanges.subscribe(
      (value) => { this.projectService.project.name = value; }
    );

    this.projectService.projectEmitter.subscribe(
      (p) => { this.project = p;
               this.nameField.setValue(p.name);
               this.userField.setValue(p.userId);
               this.deadlineField.setValue(p.deadline); }
    );

    this.projectService.userEmitter.subscribe(
      (u) => { this.user = u; }
    );

    this.projectService.getProjectUser(this.project.userId);
  }

  toggleDisplay() {
    this.displayAll = !this.displayAll;
  }

  editProject() {
  }

  resetProject() {
    this.projectService.restore();
  }
}
