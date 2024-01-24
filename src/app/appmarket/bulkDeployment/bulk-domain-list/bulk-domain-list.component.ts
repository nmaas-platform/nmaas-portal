import {Component, OnInit} from '@angular/core';
import {AppdeploymentService} from '../appdeployment.service';
import {BulkDeployment} from '../../../model/bulk-deployment';
import {BulkType} from '../../../model/bulk-response';
import {AuthService} from '../../../auth/auth.service';

@Component({
    selector: 'app-bulk-domain-list',
    templateUrl: './bulk-domain-list.component.html',
    styleUrls: []
})
export class BulkDomainListComponent implements OnInit {

    public bulks: BulkDeployment[] = [];

    public mode = BulkType.DOMAIN;

    constructor(private readonly deployService: AppdeploymentService,
                private readonly authService: AuthService) {
    }

    ngOnInit(): void {
        if (this.authService.getRoles().find(value => value === 'ROLE_VL_MANAGER') !== undefined) {
            this.deployService.getBulksDomainDeploymentsOwner().subscribe(data => {
                data = data.sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime())
                this.bulks = data
            });
        } else {
            this.deployService.getBulksDomainDeployments().subscribe(data => {
                data = data.sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime())
                this.bulks = data
            });
        }
    }

}
