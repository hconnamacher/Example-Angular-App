import { Component, OnInit } from '@angular/core';
import { CommService } from '../comm.service';
import { Project } from '../project';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})

export class ViewComponent implements OnInit {

  projects: Project[] = [];

  constructor(private commService: CommService) { }

  ngOnInit() {
    const subscription = this.commService.subscribeProjects(
      (p: Project) => { this.projects.push(p); },
      (err) => {},
      () => { subscription.unsubscribe(); }
    );

    this.commService.send({entityType: 'project', action: 'getAll'});
  }
}
