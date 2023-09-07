import {Component, OnInit} from '@angular/core';
import {DomainService} from '../../../service';
import {DomainGroup} from '../../../model/domaingroup';

@Component({
    selector: 'app-domain-groups',
    templateUrl: './domain-groups.component.html',
    styleUrls: ['./domain-groups.component.css']
})
export class DomainGroupsComponent implements OnInit {


    public groups: DomainGroup[] = [];
    public domainsRowVisible: boolean[] = []
    public searchValue: string;

    constructor(private domainService: DomainService) {
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


}
