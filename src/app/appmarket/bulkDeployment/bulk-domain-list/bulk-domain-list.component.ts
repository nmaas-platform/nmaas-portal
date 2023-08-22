import {Component, OnInit} from '@angular/core';
import {AppdeploymentService} from '../appdeployment.service';
import {BulkDeployment} from '../../../model/bulk-deployment';
import {BulkType} from '../../../model/bulk-response';

@Component({
    selector: 'app-bulk-domain-list',
    templateUrl: './bulk-domain-list.component.html',
    styleUrls: ['./bulk-domain-list.component.css']
})
export class BulkDomainListComponent implements OnInit {

    public bulks: BulkDeployment[] = [];

    public mode = BulkType.DOMAIN;

    constructor(private readonly deployService: AppdeploymentService) {
    }

    ngOnInit(): void {
        this.deployService.getBulksDomainDeployments().subscribe(data => {
            data = data.sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime())
            this.bulks = data
        });
    }

}
