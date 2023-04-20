import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';

@Component({
  selector: 'app-domainnavigator',
  templateUrl: './domain-navigator.component.html',
  styleUrls: ['./domain-navigator.component.css']
})
export class DomainNavigatorComponent implements OnInit {

  public status = -1;
  public iconPiCheck = 'pi pi-check';

  public items  = [
    {
      label: 'Upload',
    },
    {
      label: 'Summary',
    },
  ]


  constructor(protected readonly router: Router,
              protected readonly activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.checkStep();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.checkStep();
      }
    })
  }

  private checkStep() {
    console.warn('route', this.router.url)
    switch (this.router.url) {
      case '/admin/domains/deploy/upload' :
        this.status = 0;
        break;
      case '/admin/domains/deploy/summary' :
        this.status = 1
        break;
      default :
        break;
    }
    console.warn(this.status);
  }


}
