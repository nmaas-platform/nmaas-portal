import { Component, OnInit } from '@angular/core';
import {AppdeploymentService} from '../appdeployment.service';

@Component({
  selector: 'app-appsummary',
  templateUrl: './appsummary.component.html',
  styleUrls: ['./appsummary.component.css']
})
export class AppsummaryComponent implements OnInit {

  constructor(public deploy: AppdeploymentService) { }

  ngOnInit(): void {
  }

}
