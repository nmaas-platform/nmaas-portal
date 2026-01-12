import {Component, OnInit, ViewChild} from '@angular/core';
import {DomainService} from '../../../service';
import {DomainGroup} from '../../../model/domaingroup';
import {Menu} from 'primeng/menu';
import {MenuItem} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-domain-groups',
    templateUrl: './domain-groups.component.html',
    styleUrls: ['./domain-groups.component.css'],
    standalone: false
})
export class DomainGroupsComponent implements OnInit {


    public groups: DomainGroup[] = [];
    public domainsRowVisible: boolean[] = []
    public searchValue: string;

    @ViewChild('rowMenu') rowMenu!: Menu;
    rowMenuItems: MenuItem[] = [];
    selectedGroup: DomainGroup | null = null;

    constructor(private domainService: DomainService,
                public translate: TranslateService) {
    }

    ngOnInit(): void {
        this.refresh();
    }

    public clickTableRow(i: number) {
        this.domainsRowVisible[i] = !this.domainsRowVisible[i];
    }

    public deleteDomainGroup(id: number) {
        return this.domainService.deleteDomainGroup(id).subscribe(_ => {
            console.log(`Group ${id} deleted`);
            this.refresh();
        })
    }

    public refresh() {
        this.domainService.getAllDomainGroups().subscribe(data => {
            this.groups = data;
        })
    }
    openRowMenu(event: Event, domainGroup: DomainGroup) {
        this.selectedGroup = domainGroup;

        this.rowMenuItems = [
            {
                label: this.translate.instant('APPS_MANAGEMENT.EDIT_BUTTON'),
                routerLink: ['edit', domainGroup?.id]
            },
            {
                label: this.translate.instant( 'APP_INSTANCE.REMOVE_BUTTON'),
                command: () => this.deleteDomainGroup(domainGroup?.id)
            }
        ];

        this.rowMenu.toggle(event);
    }

}
