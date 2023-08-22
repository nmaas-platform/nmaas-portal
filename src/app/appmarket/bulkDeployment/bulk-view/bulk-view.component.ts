import {Component, OnDestroy, OnInit} from '@angular/core';
import {BulkDeployment} from '../../../model/bulk-deployment';
import {AppdeploymentService} from '../appdeployment.service';
import {ActivatedRoute, Router} from '@angular/router';
import {BulkResponse, BulkType} from '../../../model/bulk-response';
import {timer} from 'rxjs';
import {map} from 'rxjs/operators';
import {AppImagesService} from '../../../service';

@Component({
    selector: 'app-bulk-view',
    templateUrl: './bulk-view.component.html',
    styleUrls: ['./bulk-view.component.css']
})
export class BulkViewComponent implements OnInit, OnDestroy {

    public bulk: BulkDeployment;
    public bulkId;
    public bulkType: BulkType = BulkType.DOMAIN;

    public refresh = undefined;

    constructor(public deployService: AppdeploymentService,
                private route: ActivatedRoute,
                private router: Router,
                public appImagesService: AppImagesService,
    ) {
    }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            if (params['id'] !== undefined) {
                this.bulkId = +params['id'];
                this.deployService.getBulkDeployment(this.bulkId).subscribe(
                    (bulk) => {
                        this.bulk = bulk;
                        this.bulkType = bulk.type;
                        if (this.bulkType === BulkType.APPLICATION) {
                            this.update();
                        }
                    },
                    err => {
                        console.error(err);
                        if (err.statusCode && (err.statusCode === 404 ||
                            err.statusCode === 401 || err.statusCode === 403 || err.statusCode === 500)) {
                            this.router.navigateByUrl('/notfound');
                        }
                    }
                )
            }
        });
    }

    public getDetails(entry: BulkResponse) {
        if (entry.type === 'USER') {
            return `Username: ${entry.details['userName']} email: ${entry.details['email']} userId: ${entry.details['userId']}`
        } else if (entry.type === 'DOMAIN') {
            return `DomainId: ${entry.details['domainId']} name: ${entry.details['domainName']}`
        } else if (entry.type === 'APPLICATION') {
            return `AppInstanceId: ${entry.details['appInstanceId']} name: ${entry.details['appInstanceName']} domain: ${entry.details['domainCodename']}`
        }
    }

    public getAppInstanceId(entry: BulkResponse) {
        return entry?.details['appInstanceId']
    }

    public getAppInstanceName(entry: BulkResponse) {
        return entry?.details['appInstanceName']
    }

    public getDomainCodeName(entry: BulkResponse) {
        return entry?.details['domainCodename'] || entry?.details['domainName']
    }

    public update() {
        this.refresh = timer(0, 20000).pipe(map(() => {
            this.deployService.getBulkDeployment(this.bulk.id).subscribe(bulk => {
                this.bulk = bulk;
            })
        })).subscribe()
    }

    public ngOnDestroy() {
        if (this.refresh !== undefined) {
            this.refresh.unsubscribe();
        }
    }

}
