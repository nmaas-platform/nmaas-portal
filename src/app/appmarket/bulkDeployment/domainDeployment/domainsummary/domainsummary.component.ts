import { Component, OnInit } from '@angular/core';
import {AppdeploymentService} from '../../appdeployment.service';

@Component({
  selector: 'app-domainsummary',
  templateUrl: './domainsummary.component.html',
  styleUrls: ['./domainsummary.component.css']
})
export class DomainsummaryComponent implements OnInit {

  constructor(public deploy: AppdeploymentService) { }

  ngOnInit(): void {
  }

}
