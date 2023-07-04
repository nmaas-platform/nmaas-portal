import {Component, OnInit} from '@angular/core';
import {BulkDeployment} from '../../../model/bulk-deployment';
import {AppdeploymentService} from '../appdeployment.service';
import {ActivatedRoute, Router} from '@angular/router';
import {BulkReplay, BulkType} from '../../../model/bulk-replay';

@Component({
  selector: 'app-bulk-view',
  templateUrl: './bulk-view.component.html',
  styleUrls: ['./bulk-view.component.css']
})
export class BulkViewComponent implements OnInit {

  public bulk: BulkDeployment;
  public bulkId;
  public bulkType: BulkType = BulkType.DOMAIN;

  constructor(private readonly deployService: AppdeploymentService,
              private route: ActivatedRoute,
              private router: Router,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id'] !== undefined) {
        this.bulkId = +params['id'];
        this.deployService.getBulkDeployment(this.bulkId).subscribe(
            (bulk) => {
              this.bulk = bulk;
              this.bulkType = bulk.type;
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

  public getDetails(entry: BulkReplay) {
    if (entry.type === 'USER') {
      return `Username: ${entry.details['userName']} email: ${entry.details['email']} userId: ${entry.details['userId']}`
    } else if (entry.type === 'DOMAIN') {
      return `DomainId: ${entry.details['domainId']} name: ${entry.details['domainName']}`
    } else {
      return ''
    }
  }



}
