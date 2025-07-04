import { Component, OnInit } from '@angular/core';
import {ApplicationBase} from '../../../../model/application-base';
import {AppsService, ConfigurationService} from '../../../../service';
import {AppdeploymentService} from '../../appdeployment.service';
import {ActivatedRoute, Router} from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-appselection',
    templateUrl: './appdeployment.component.html',
    styleUrls: ['./appdeployment.component.css'],
    standalone: false
})
export class AppdeploymentComponent implements OnInit {

  public apps: ApplicationBase[] = [];

  public selectedApp: ApplicationBase = null;

  public parallelDeploymentsLimit = 1;
  public limitFromConfiguration = 50;

  public selectedAppId: number;

  myGroup : FormGroup;

  constructor(private readonly appService: AppsService,
              private readonly deployService: AppdeploymentService,
              private router: Router,
              private readonly configuration: ConfigurationService,
              private readonly route: ActivatedRoute) { }

        
  ngOnInit(): void {
    this.selectedAppId = this.route.snapshot.queryParams['id'];
    this.appService.getAllActiveApplicationBase().subscribe(data => {
      data.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);
      this.apps = data;
      if(this.selectedAppId !== undefined && this.selectedAppId !== null) {
        this.selectedApp = this.apps.find(app => app.id == this.selectedAppId);
        if(this.selectedApp) {
          console.log("Selected app", this.selectedApp.name)
          this.deployService.setSelectedApp(this.selectedApp);
        } else {
          console.warn("Selected app not found in the list");
        }
      }
    });
    this.configuration.getConfiguration().subscribe(configuration => {
      this.limitFromConfiguration = configuration.parallelDeploymentsLimit;
      console.log("Limit from config", this.limitFromConfiguration)
      this.parallelDeploymentsLimit = configuration.parallelDeploymentsLimit;
      })

  }
  

  public onKeyPress(event) {
    console.log(event);
    if(event < 1) {
      this.parallelDeploymentsLimit = 1;
      console.log("Changing limit to ", this.parallelDeploymentsLimit )
    }
    if(event > this.limitFromConfiguration ) {
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
