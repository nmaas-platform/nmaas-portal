import { Component, OnInit } from '@angular/core';
import {BulkDeployment} from '../../../model/bulk-deployment';
import {AppdeploymentService} from '../appdeployment.service';

@Component({
  selector: 'app-bulk-app-list',
  templateUrl: './bulk-app-list.component.html',
  styleUrls: ['./bulk-app-list.component.css']
})
export class BulkAppListComponent implements OnInit {

  public bulks: BulkDeployment[] = [];

  constructor(private readonly deployService: AppdeploymentService) { }

  ngOnInit(): void {
    this.deployService.getBulksAppDeployments().subscribe(data => this.bulks = data);
  }
}
