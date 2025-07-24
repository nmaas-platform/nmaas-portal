import {Component} from '@angular/core';
import {AppdeploymentService} from '../../appdeployment.service';

@Component({
    selector: 'app-appsummary',
    templateUrl: './appsummary.component.html',
    styleUrls: [],
    standalone: false
})
export class AppsummaryComponent {

    constructor(public deploy: AppdeploymentService) {
    }

}
