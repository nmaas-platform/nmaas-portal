import { Component, OnInit } from '@angular/core';
import {AppdeploymentService} from '../appdeployment.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-appupload',
  templateUrl: './appupload.component.html',
  styleUrls: ['./appupload.component.css']
})
export class AppuploadComponent implements OnInit {

  constructor(private readonly deployService: AppdeploymentService,
              private router: Router) { }

  ngOnInit(): void {
    console.warn("selected app", this.deployService.getSelectedApp())
  }

  myUploader(event: any) {
    console.log(event.files[0])
    //TODO add some in progress bar when waiting for information
    this.deployService.uploadApplicationFile(event.files[0]).subscribe( val => {
      console.warn("done")
      this.deployService.result = val;
      this.router.navigate(['deploy/summary'])

    });
  }
}
