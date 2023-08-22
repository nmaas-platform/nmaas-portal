import { Component, OnInit } from '@angular/core';
import {ApplicationBase} from '../../../../model/application-base';
import {AppsService} from '../../../../service';
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

  constructor(private readonly appService: AppsService,
              private readonly deployService: AppdeploymentService,
              private router: Router) { }

  ngOnInit(): void {
    this.appService.getAllActiveApplicationBase().subscribe(data => {
      data.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);
      this.apps = data
    });
  }

  selectApp() {
    this.deployService.setSelectedApp(this.selectedApp);
    this.router.navigate(['admin/apps/bulks/new/upload'])
  }
}
