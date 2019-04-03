/* A unit test for the angular project.
 * Provides an example of testing asynchronous routines.
 */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EventEmitter } from '@angular/core';

import { ProjectComponent } from './project.component';
import { Project, User } from '../../project';
import { ProjectService } from '../project.service';

describe('ProjectComponent', () => {
  let component: ProjectComponent;
  let service: ProjectService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectComponent ],
      imports: [ FormsModule, ReactiveFormsModule ],
      providers: [ ProjectComponent,
         { provide: ProjectService, useClass: MockProjectService }
        ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    component = TestBed.get(ProjectComponent);
    service = TestBed.get(ProjectService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // This is an example of an asynchronos test.
  // It uses the done function to make sure that the observable
  //  completes before calling the tests on the observable data.
  describe('service is sending project info: ', () => {
    beforeEach((done) => {
        component.ngOnInit();
        service.project = {id: 1, userId: 10, name: 'Test Project', deadline: new Date()};
        service.projectEmitter.subscribe((p) => done());
        service.restore();
      });

    it('checking project received', () => {
        expect(component.project.userId).toBe(9); }, 100);
    });
});

/* Create a fake ProjectService to use for the unit tests.
 * This way we can test without creating a websocket to a server.
 */
class MockProjectService {
  currentProject: Project;
  projectUser: User;
  projectEmitter: EventEmitter<Project> = new EventEmitter<Project>(true);
  userEmitter: EventEmitter<User> = new EventEmitter<User>(true);

  constructor() { }

  set project(p: Project) {
    this.currentProject = p;
  }

  get project(): Project {
    return this.currentProject;
  }

  getProjectUser(id: number) {
  }

  restore() {
    this.projectEmitter.emit(this.currentProject);
  }
}
