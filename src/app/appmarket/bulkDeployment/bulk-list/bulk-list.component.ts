import {Component, Input, OnInit} from '@angular/core';
import {BulkDeployment} from '../../../model/bulk-deployment';
import {BulkType} from '../../../model/bulk-replay';

@Component({
  selector: 'app-bulk-list',
  templateUrl: './bulk-list.component.html',
  styleUrls: ['./bulk-list.component.css']
})
export class BulkListComponent implements OnInit {

  @Input()
  public bulks: BulkDeployment[] = [];

  @Input()
  public header: string;

  @Input()
  public mode: BulkType;

  public readonly bulkTypeDomain = BulkType.DOMAIN;
  public readonly bulkTypeApp = BulkType.APPLICATION;



  constructor() { }

  ngOnInit(): void {
  }

}
