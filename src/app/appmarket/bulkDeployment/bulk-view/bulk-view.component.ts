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

    public getAppInstanceId(entry: BulkResponse) {
        return entry?.details['appInstanceId']
    }

    public getAppInstanceName(entry: BulkResponse) {
        return entry?.details['appInstanceName']
    }

    public getDomainCodeName(entry: BulkResponse) {
        return entry?.details['domainCodename'] || entry?.details['domainName']
    }

    public getUsername(entry: BulkResponse) {
        return entry?.details['userName']
    }

    public getEmail(entry: BulkResponse) {
        return entry?.details['email']
    }

    public getUserId(entry: BulkResponse) {
        return entry?.details['userId']
    }

    public getDomainId(entry: BulkResponse) {
        return entry?.details['domainId']
    }

    public getDomainName(entry: BulkResponse) {
        return entry?.details['domainName']
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

    public getAppBulkDetails(id: number) {
        this.deployService.getAppBulkDetails(id).subscribe( (data: Blob) => {
            console.warn(data)
            const blob = new Blob([data], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `NMaaS-AppBulk-${id}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        })
    }

}
