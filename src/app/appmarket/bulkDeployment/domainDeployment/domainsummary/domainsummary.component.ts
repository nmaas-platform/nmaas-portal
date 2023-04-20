import {Component, OnInit} from '@angular/core';
import {AppdeploymentService} from '../../appdeployment.service';
import {BulkReplay, BulkType} from '../../../../model/bulk-replay';

@Component({
  selector: 'app-domainsummary',
  templateUrl: './domainsummary.component.html',
  styleUrls: ['./domainsummary.component.css']
})
export class DomainsummaryComponent implements OnInit {

  constructor(public deploy: AppdeploymentService) { }

  ngOnInit(): void {
    console.warn(this.deploy.result);
  }

  public getDetails(entry: BulkReplay) {
    if (entry.type === 'USER') {
      return `Username: ${entry.details['userName']} email: ${entry.details['email']} userId: ${entry.details['userId']}`
    } else if (entry.type === 'DOMAIN') {
      return `Domain: ${entry.details['domainId']} name: ${entry.details['domainName']}`
    } else {
      return ''
    }
}

}
