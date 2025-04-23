import {Component} from '@angular/core';
import {AppdeploymentService} from '../../appdeployment.service';
import {Router} from '@angular/router';
import {BulkType} from '../../../../model/bulk-response';
import {DomainService} from '../../../../service';

@Component({
    selector: 'app-domainupload',
    templateUrl: './domainupload.component.html',
    styleUrls: ['./domainupload.component.css']
})
export class DomainuploadComponent {

    public showProgressBar = false;

    public csvText = '"domain","username","networks","domainGroups","email","ssoEnabled"\n' +
        '"ExDom1","TestUsr1","","ExGroup1","test1@user.com","true"\n' +
        '"ExDom2","TestUsr2","","ExGroup2","test2@user.com","false"\n';

    public errorMessage = '';
    public changeDetector = false;

    constructor(private readonly deployService: AppdeploymentService,
                private router: Router,
                private domainService: DomainService) {
    }

    myUploader(event: any) {
        console.log(event.files[0])
        this.upload(event.files[0])
    }

    public uploadText() {
        const file = new File([this.csvText], 'Upload.csv', {type: 'text/csv'})
        this.upload(file)
    }

    private upload(file: any) {
        this.showProgressBar = true;
        this.deployService.uploadUserDomainFile(file).subscribe(val => {
                console.warn('done')
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
