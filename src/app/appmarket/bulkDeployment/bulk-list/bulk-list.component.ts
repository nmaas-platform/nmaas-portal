import {Component, Input, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {BulkDeployment} from '../../../model/bulk-deployment';
import {BulkType} from '../../../model/bulk-replay';
import {SortableHeaderDirective} from '../../../service/sort-domain.directive';
import {ModalComponent} from '../../../shared';

@Component({
    selector: 'app-bulk-list',
    templateUrl: './bulk-list.component.html',
    styleUrls: ['./bulk-list.component.css']
})
export class BulkListComponent implements OnInit {

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

    @ViewChild(ModalComponent, { static: true })
    public readonly modal: ModalComponent;


    public readonly bulkTypeDomain = BulkType.DOMAIN;
    public readonly bulkTypeApp = BulkType.APPLICATION;

    public itemsPerPage: number[] = [15, 20, 25, 30, 50];
    public maxItemsOnPage = 15;
    p: number;
    public searchValue = '';

    public removeAll = false;

    constructor() {
    }

    ngOnInit() {
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
                this.bulks = this.bulks.sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime())
            } else {
                this.bulks = this.bulks.sort((a, b) => new Date(a.creationDate).getTime() - new Date(b.creationDate).getTime())

            }
        } else {
            this.bulks = this.bulks.sort((a, b) => {
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
}
