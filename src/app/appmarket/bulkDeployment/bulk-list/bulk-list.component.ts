import { Component, OnInit } from '@angular/core';
import {AppdeploymentService} from '../appdeployment.service';
import {BulkDeployment} from '../../../model/bulk-deployment';

@Component({
  selector: 'app-bulk-list',
  templateUrl: './bulk-list.component.html',
  styleUrls: ['./bulk-list.component.css']
})
export class BulkListComponent implements OnInit {

  public bulks: BulkDeployment[] = [];

  constructor(private readonly deployService: AppdeploymentService) { }

  ngOnInit(): void {
    this.deployService.getBulksDeployment().subscribe(data => this.bulks = data);
  }

}
