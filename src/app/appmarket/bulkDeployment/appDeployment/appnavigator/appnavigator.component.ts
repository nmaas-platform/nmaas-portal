import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';


@Component({
  selector: 'app-appnavigator',
  templateUrl: './appnavigator.component.html',
  styleUrls: ['./appnavigator.component.css']
})
export class AppnavigatorComponent implements OnInit {

  public status = -1;
  public iconPiCheck = 'pi pi-check';

  public items  = [{
    label: 'Select',
  },
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
    switch (this.router.url) {
      case '/admin/apps/bulks/new/select' :
      this.status = 0;
        break;
      case '/admin/apps/bulks/new/upload' :
        this.status = 1
        break;
      case '/admin/apps/bulks/new/summary' :
        this.status = 2
        break;
      default :
        break;
    }
  }

}
