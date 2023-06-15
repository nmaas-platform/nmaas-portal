import {Component, Input, OnInit} from '@angular/core';
import {BulkDeployment} from '../../../model/bulk-deployment';

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


  constructor() { }

  ngOnInit(): void {
  }

}
