import {Component, OnInit} from '@angular/core';
import {AppdeploymentService} from '../../appdeployment.service';
import {Router} from '@angular/router';
import {BulkType} from '../../../../model/bulk-response';
import {DomainService} from '../../../../service';

@Component({
  selector: 'app-domainupload',
  templateUrl: './domainupload.component.html',
  styleUrls: ['./domainupload.component.css']
})
export class DomainuploadComponent implements OnInit {

  public showProgressBar = false;

  public csvText = '"domain","username","networks","domainGroups","email"\n' +
      '"ExampleDomain","TestUser","","Lab1","email@domain.com"\n' +
      '"ExampleDomain2","TestUser2","","Lab1","email2@domain.com"\n';

  public errorMessage = '';
  public changeDetector = false;

  constructor(private readonly deployService: AppdeploymentService,
              private router: Router,
              private domainService: DomainService) { }

  ngOnInit(): void {
  }

  myUploader(event: any) {
    console.log(event.files[0])
    // TODO add some in progress bar when waiting for information
    this.showProgressBar = true;
    this.deployService.uploadUserDomainFile(event.files[0]).subscribe( val => {
      console.warn("done")
      this.deployService.bulk = val;
      this.domainService.setUpdateRequiredFlag(true);
          if (val.type === BulkType.DOMAIN) {
        this.router.navigate(['admin/domains/bulks/', val.id])
      } else {
        this.router.navigate(['admin/domains/deploy/summary'])
      }
    },
        error => {
          console.error(error);
          this.showProgressBar = false;
          this.errorMessage = error.error.message || 'Error with uploading csv file';
        });
  }

  public uploadText() {

    let file = new File([this.csvText], "Upload.csv", {type: 'text/csv' })

    this.deployService.uploadUserDomainFile(file).subscribe( val => {
      console.warn("done")
      this.deployService.bulk = val;
      this.domainService.setUpdateRequiredFlag(true);
          if (val.type === BulkType.DOMAIN) {
        this.router.navigate(['admin/domains/bulks/', val.id])
      } else {
        this.router.navigate(['admin/domains/deploy/summary'])
      }
    },
        error => {
        console.error(error);
        this.showProgressBar = false;
        this.errorMessage = error.error.message || 'Error with uploading csv file';
        });
  }

}
