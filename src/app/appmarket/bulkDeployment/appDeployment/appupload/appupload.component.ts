import {Component, OnInit} from '@angular/core';
import {AppdeploymentService} from '../../appdeployment.service';
import {Router} from '@angular/router';
import {AppImagesService} from '../../../../service';

@Component({
    selector: 'app-appupload',
    templateUrl: './appupload.component.html',
    styleUrls: ['./appupload.component.css']
})
export class AppuploadComponent implements OnInit {

    public showProgressBar = false;

    public csvText = '"domain","instance","version","param.x","param.y"\n' +
        '"Domain 1","instance-1","4.0.0","Param1","Param2"\n' +
        '"Domain 2","instance-2","4.0.0","Param3","Param4"\n';

    public errorMessage = '';
    public changeDetector = false;

    constructor(public readonly deployService: AppdeploymentService,
                private router: Router,
                public appImagesService: AppImagesService,
    ) {
    }

    ngOnInit(): void {
        console.warn('selected app', this.deployService.getSelectedApp())
    }

    myUploader(event: any) {
        console.log(event.files[0])
        this.showProgressBar = true;
        this.deployService.uploadApplicationFile(event.files[0], this.deployService.getSelectedApp()).subscribe(val => {
            console.warn('done')
            this.router.navigate(['admin/apps/bulks/', val.id])
        }, error => {
            console.error(error);
            this.showProgressBar = false;
            this.errorMessage = error.error.message || 'Error with uploading csv file';
        });
    }

    public uploadText() {

        let file = new File([this.csvText], 'Upload.csv', {type: 'text/csv'})
        this.showProgressBar = true;
        this.deployService.uploadApplicationFile(file, this.deployService.getSelectedApp()).subscribe(val => {
                console.warn('done')
                this.router.navigate(['admin/apps/bulks/', val.id])
            },
            error => {
                console.error(error);
                this.showProgressBar = false;
                this.errorMessage = error.error.message || 'Error with uploading csv file';
            });
    }
}
