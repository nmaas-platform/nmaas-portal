import {Component, OnInit, ViewChild} from '@angular/core';
import {DomainService} from '../../../service';
import {DomainGroup} from '../../../model/domaingroup';
import {ModalComponent} from '../../../shared';

@Component({
  selector: 'app-domain-groups',
  templateUrl: './domain-groups.component.html',
  styleUrls: ['./domain-groups.component.css']
})
export class DomainGroupsComponent implements OnInit {



  public groups: DomainGroup[] = [];
  public domainsRowVisible: boolean[] = []

  constructor(private domainService: DomainService) { }

  ngOnInit(): void {
    this.domainService.getAllDomainGroups().subscribe(data => {
      this.groups = data;
    })
  }

  public clickTableRow(i: number) {
    this.domainsRowVisible[i] = !this.domainsRowVisible[i];
  }



}
