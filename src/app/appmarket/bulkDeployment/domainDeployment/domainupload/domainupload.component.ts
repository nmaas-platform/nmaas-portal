import { Component, OnInit } from '@angular/core';
import {AppdeploymentService} from '../../appdeployment.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-domainupload',
  templateUrl: './domainupload.component.html',
  styleUrls: ['./domainupload.component.css']
})
export class DomainuploadComponent implements OnInit {

  constructor(private readonly deployService: AppdeploymentService,
              private router: Router) { }

  ngOnInit(): void {
  }

  myUploader(event: any) {
    console.log(event.files[0])
    // TODO add some in progress bar when waiting for information
    this.deployService.uploadUserDomainFile(event.files[0]).subscribe( val => {
      console.warn("done")
      this.deployService.result = val;
      this.router.navigate(['admin/domains/deploy/summary'])
    });
  }

}
