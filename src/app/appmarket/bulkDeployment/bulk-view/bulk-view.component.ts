import {Component, OnDestroy, OnInit} from '@angular/core';
import {BulkDeployment, BulkDeploymentState} from '../../../model/bulk-deployment';
import {AppdeploymentService} from '../appdeployment.service';
import {ActivatedRoute, Router} from '@angular/router';
import {BulkResponse, BulkType} from '../../../model/bulk-response';
import {timer} from 'rxjs';
import {map} from 'rxjs/operators';
import {AppImagesService} from '../../../service';
import { BulkQueueDetails } from '../../../model/bulk-queue-details';

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

    public progressBarMode ;
    public progressBarValue ;

    public queueDetails :BulkQueueDetails; 

    public jobDone = false;

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
                        this.getQueueDetails();
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

    public iSWorkingInstance(entry: BulkResponse) {
        return entry?.state === BulkDeploymentState.COMPLETED || entry?.state.toString() == 'COMPLETED'
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
                if(bulk.state === 'REMOVED') this.refresh.unsubscribe();
                if(bulk.state === 'PROCESSING' && this.queueDetails.jobInProcessId === bulk.id) {
                    this.progressBarMode = "determinate"
                    this.setBarValue();
                } else if(bulk.state === 'PROCESSING') {
                    this.setBarValue();
                    this.progressBarMode = "indeterminate"
                } else {
                    this.progressBarMode = "determinate"
                    this.setBarValue();
                }
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
            a.download = `nmaas-bulk-applications-${id}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        })
    }


    public refreshStates() {
        this.deployService.refreshStatesInBulkDeployment(this.bulkId).subscribe( deply => {
            this.bulk = deply;
            this.getQueueDetails();
            console.log("Updated states of bulks")
        })
    }

    public setBarValue() {
        this.getQueueDetails();
    }
    
    public getQueueDetails(): void {
     this.deployService.getQueueDetails(this.bulkId).subscribe(queue => {
        console.log(queue);
        this.queueDetails = queue;
        if(queue.jobDone === this.bulk.entries.length) {
            this.progressBarValue = 100;
            this.jobDone = true;
        } else {
            this.progressBarValue =  queue.jobDone * 100 / this.bulk.entries.length;
            this.jobDone = false;
        }
        
     })   
    }
}
