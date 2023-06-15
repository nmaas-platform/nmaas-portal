import {Component, OnInit} from '@angular/core';
import {AppdeploymentService} from '../../appdeployment.service';
import {Router} from '@angular/router';
import {BulkType} from '../../../../model/bulk-replay';

@Component({
  selector: 'app-domainupload',
  templateUrl: './domainupload.component.html',
  styleUrls: ['./domainupload.component.css']
})
export class DomainuploadComponent implements OnInit {

  public showProgressBar = false;

  constructor(private readonly deployService: AppdeploymentService,
              private router: Router) { }

  ngOnInit(): void {
  }

  myUploader(event: any) {
    console.log(event.files[0])
    // TODO add some in progress bar when waiting for information
    this.deployService.uploadUserDomainFile(event.files[0]).subscribe( val => {
      console.warn("done")
      this.deployService.bulk = val;
      if (val.type === BulkType.DOMAIN) {
        this.router.navigate(['admin/domains/bulks/', val.id])
      } else {
        this.router.navigate(['admin/domains/deploy/summary'])
      }
    });
    this.showProgressBar = true;
  }

}
