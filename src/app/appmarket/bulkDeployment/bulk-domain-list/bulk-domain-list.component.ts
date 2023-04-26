import { Component, OnInit } from '@angular/core';
import {AppdeploymentService} from '../appdeployment.service';
import {BulkDeployment} from '../../../model/bulk-deployment';

@Component({
  selector: 'app-bulk-domain-list',
  templateUrl: './bulk-domain-list.component.html',
  styleUrls: ['./bulk-domain-list.component.css']
})
export class BulkDomainListComponent implements OnInit {

  public bulks: BulkDeployment[] = [];

  constructor(private readonly deployService: AppdeploymentService) { }

  ngOnInit(): void {
    this.deployService.getBulksDomainDeployments().subscribe(data => this.bulks = data);
  }

}
