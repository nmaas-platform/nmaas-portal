import { Component, OnInit } from '@angular/core';
import {AppdeploymentService} from '../../appdeployment.service';
import {Router} from '@angular/router';
import {BulkType} from '../../../../model/bulk-replay';

@Component({
  selector: 'app-appupload',
  templateUrl: './appupload.component.html',
  styleUrls: ['./appupload.component.css']
})
export class AppuploadComponent implements OnInit {

  public showProgressBar = false;

  public csvText = '';

  public errorMessage = '';

  constructor(private readonly deployService: AppdeploymentService,
              private router: Router) { }

  ngOnInit(): void {
    console.warn("selected app", this.deployService.getSelectedApp())
  }

  myUploader(event: any) {
    console.log(event.files[0])
    this.showProgressBar = true;
    this.deployService.uploadApplicationFile(event.files[0], this.deployService.getSelectedApp()).subscribe( val => {
      console.warn("done")
      this.router.navigate(['admin/apps/bulks/', val.id])
    });
  }

  public uploadText() {

    let file = new File([this.csvText], "Upload.csv", {type: 'text/csv' })
    this.showProgressBar = true;
    this.deployService.uploadApplicationFile(file, this.deployService.getSelectedApp()).subscribe( val => {
          console.warn("done")
            this.router.navigate(['admin/apps/bulks/', val.id])
        },
        error => {
          console.error(error);
          this.errorMessage = error.error.message || 'Error with uploading csv file';
        });
  }
}
