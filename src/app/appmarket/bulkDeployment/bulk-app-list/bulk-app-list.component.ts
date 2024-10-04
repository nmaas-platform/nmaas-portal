import {Component, OnInit} from '@angular/core';
import {BulkDeployment} from '../../../model/bulk-deployment';
import {AppdeploymentService} from '../appdeployment.service';
import {BulkType} from '../../../model/bulk-response';
import {AuthService} from '../../../auth/auth.service';

@Component({
    selector: 'app-bulk-app-list',
    templateUrl: './bulk-app-list.component.html',
    styleUrls: []
})
export class BulkAppListComponent implements OnInit {

    public bulks: BulkDeployment[] = [];

    public mode = BulkType.APPLICATION;

    constructor(private readonly deployService: AppdeploymentService,
                private readonly authService: AuthService) {
    }

    ngOnInit(): void {
        if (this.authService.getRoles().find(value => value === 'ROLE_VL_MANAGER') !== undefined) {
            this.deployService.getBulksAppDeploymentsOwner().subscribe(data => {
                data = data.sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime())
                this.bulks = data
            });
        } else {
            this.deployService.getBulksAppDeployments().subscribe(data => {
                data = data.sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime())
                this.bulks = data
            });
        }
    }
}
