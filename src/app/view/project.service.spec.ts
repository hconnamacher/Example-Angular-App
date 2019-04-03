import { TestBed } from '@angular/core/testing';

import { ProjectService } from './project.service';
import { CommService } from '../comm.service';

describe('ProjectService', () => {
  beforeEach(() => TestBed.configureTestingModule({ }));

  // create a "fake" CommService for testing the ProjectService
  it('should be created', () => {
    const commServiceSpy =
       jasmine.createSpyObj('CommService', ['send', 'subscribeFilteredProject', 'subscribeFilteredUsers',
                            'subscribeProjects', 'subscribeUsers']);
    const service = new ProjectService(commServiceSpy);
    expect(service).toBeTruthy();
  });
});
