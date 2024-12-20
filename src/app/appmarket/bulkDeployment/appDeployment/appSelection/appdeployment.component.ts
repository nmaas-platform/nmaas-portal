import { Component, OnInit } from '@angular/core';
import {ApplicationBase} from '../../../../model/application-base';
import {AppsService, ConfigurationService} from '../../../../service';
import {AppdeploymentService} from '../../appdeployment.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-appselection',
  templateUrl: './appdeployment.component.html',
  styleUrls: ['./appdeployment.component.css']
})
export class AppdeploymentComponent implements OnInit {

  public apps: ApplicationBase[] = [];

  public selectedApp: ApplicationBase = null;

  public parallelDeploymentsLimit = 0;
  public limitFromConfiguration = 50;

  constructor(private readonly appService: AppsService,
              private readonly deployService: AppdeploymentService,
              private router: Router,
              private readonly configuration: ConfigurationService) { }

  ngOnInit(): void {
    this.appService.getAllActiveApplicationBase().subscribe(data => {
      data.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);
      this.apps = data
    });
    this.configuration.getConfiguration().subscribe(configuration => {
      this.limitFromConfiguration = configuration.parallelDeploymentsLimit;
      console.log("Limit from config", this.limitFromConfiguration)
      })

  }
  

  public onKeyPress(event) {
    console.log(event);
    if(event > this.limitFromConfiguration) {
      console.log("Changing limit to ", this.limitFromConfiguration)
      this.parallelDeploymentsLimit = this.limitFromConfiguration;
    }
  }

  selectApp() {
    this.deployService.setSelectedApp(this.selectedApp);
    this.deployService.setParallel(this.parallelDeploymentsLimit);
    this.router.navigate(['admin/apps/bulks/new/upload'])
  }
}
