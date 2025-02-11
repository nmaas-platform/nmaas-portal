import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {BulkDeployment} from '../../../model/bulk-deployment';
import {BulkType} from '../../../model/bulk-response';
import {SortableHeaderDirective} from '../../../service/sort-domain.directive';
import {ModalComponent} from '../../../shared';
import {AppdeploymentService} from '../appdeployment.service';
import {DomSanitizer} from '@angular/platform-browser';
import { BulkQueueDetails } from '../../../model/bulk-queue-details';
import { map, timer } from 'rxjs';
import { ConfigurationService } from '../../../service';

@Component({
    selector: 'app-bulk-list',
    templateUrl: './bulk-list.component.html',
    styleUrls: ['./bulk-list.component.css']
})
export class BulkListComponent implements OnDestroy, OnInit {

    public static BULK_ENTRY_DETAIL_KEY_APP_INSTANCE_NO = 'appInstanceNo';
    public static BULK_ENTRY_DETAIL_KEY_APP_INSTANCE_NAME = 'appName';
    public readonly bulk_list_number_key = 'NUMBER_OF_BULK_LIST_ITEM_KEY';

    @Input()
    public bulks: BulkDeployment[] = [];

    @Input()
    public header: string;

    @Input()
    public mode: BulkType;

    @ViewChildren(SortableHeaderDirective)
    headers: QueryList<SortableHeaderDirective>;

    @ViewChild(ModalComponent, {static: true})
    public readonly modal: ModalComponent;

    @Output()
    public refresh: EventEmitter<boolean> = new EventEmitter<boolean>();

    public showDeleted = false;

    public readonly bulkTypeDomain = BulkType.DOMAIN;
    public readonly bulkTypeApp = BulkType.APPLICATION;

    public itemsPerPage: number[] = [15, 20, 25, 30, 50];
    public maxItemsOnPage = 15;
    p: number;
    public searchValue = '';

    public removeAll = false;
    public removeBulkId = 0;

    public queueDetails : BulkQueueDetails;

    public refreshQueue = undefined;
    public sidebarVisible4 = false;

    public configRefresh = 60;


    constructor(private appDeploy: AppdeploymentService,
                private sanitizer: DomSanitizer,
                private configService: ConfigurationService) {   
    }

    public ngOnInit(): void {
        this.configService.getConfiguration().subscribe(conf => {
            this.configRefresh = conf.bulkDeploymentQueueRefresh;
            this.update();
        })
    }

    public getApplicationName(details: Map<string, string>) {
        return details[BulkListComponent.BULK_ENTRY_DETAIL_KEY_APP_INSTANCE_NAME];
    }

    public getInstancesNumber(details: Map<string, string>) {
        return details[BulkListComponent.BULK_ENTRY_DETAIL_KEY_APP_INSTANCE_NO];
    }

    public setItems(item) {
        // store max items per page value in this session
        sessionStorage.setItem(this.bulk_list_number_key, item);
        this.maxItemsOnPage = item;
    }

    onSort(event: any) {
        const sortColumn = event.sortColumn;
        const direction = event.sortDirection;
        console.warn(event)
        // resetting other headers
        this.headers.forEach((header) => {
            if (header.sortable !== sortColumn) {
                header.direction = '';
            }
        });
        if (sortColumn === 'date') {
            if (direction === 'desc') {
                this.bulks.sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime())
            } else {
                this.bulks.sort((a, b) => new Date(a.creationDate).getTime() - new Date(b.creationDate).getTime())

            }
        } else if (sortColumn === "app_name" || sortColumn === 'instance_no') {
            this.bulks.sort((a, b) => {
                if (direction === 'asc') {
                    if (this.getProperty(a, sortColumn) > this.getProperty(b, sortColumn) ) {
                        return 1;
                    }

                    if (this.getProperty(a, sortColumn)  < this.getProperty(b, sortColumn)) {
                        return -1;
                    }
                    return 0;
                } else {
                    if (this.getProperty(a, sortColumn)  > this.getProperty(b, sortColumn)) {
                        return -1;
                    }

                    if (this.getProperty(a, sortColumn)  < this.getProperty(b, sortColumn)) {
                        return 1;
                    }
                    return 0;
                }
            })
        } else {
            this.bulks.sort((a, b) => {
                if (direction === 'asc') {
                    if (a[sortColumn] > b[sortColumn]) {
                        return 1;
                    }

                    if (a[sortColumn] < b[sortColumn]) {
                        return -1;
                    }
                    return 0;
                } else {
                    if (a[sortColumn] > b[sortColumn]) {
                        return -1;
                    }

                    if (a[sortColumn] < b[sortColumn]) {
                        return 1;
                    }
                    return 0;
                }
            })
        }
    }

    public getAppBulkDetails(id: number) {
        this.appDeploy.getAppBulkDetails(id).subscribe( (data: Blob) => {
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

    private getProperty(bulk: BulkDeployment, key : string) {
        if(key === 'app_name') {
            return bulk.details['appName']

        } else if(key === "instance_no") {
            return bulk.details['appInstanceNo']
        }
        return null
    }

    public removeBulk(): void {
        this.appDeploy.removeBulkDeployment(this.removeBulkId, this.removeAll).subscribe(_ => {
            this.refreshBulks();
            this.modal.hide();
        })
        this.removeAll = false;
    }

    public refreshBulks(): void {
        this.refresh.emit(this.showDeleted);
    }

    public getQueueDetails(): void {
        this.appDeploy.getQueueDetails(0).subscribe(queue => {
           console.log(queue);
           this.queueDetails = queue;
        })   
    }

     public update() {
            this.refreshQueue = timer(0, this.refreshQueue * 1000).pipe(map(() => {
              this.getQueueDetails();
            })).subscribe()
        }

    public getQueryNumber() {
        return this.queueDetails?.jobInQueue + this.queueDetails?.jobInProcess;
    }

        
    public ngOnDestroy() {
        if (this.refresh !== undefined) {
            this.refresh.unsubscribe();
            this.refreshQueue.unsubscribe();
        }
    }

    public open() {

    }
}
