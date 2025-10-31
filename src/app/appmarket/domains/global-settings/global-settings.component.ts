import { Component, OnInit } from '@angular/core';
import {GlobalResourcesLimit} from '../../../model/global-resources-limit';
import {ResourcesLimitService} from '../../../service/resources-limit.service';



@Component({
  selector: 'app-global-settings',
  templateUrl: './global-settings.component.html',
  styleUrl: './global-settings.component.css',
  standalone: false
})
export class GlobalSettingsComponent {

  globalResourcesLimit: GlobalResourcesLimit = {
    limitType: 'GLOBAL',
  };

  constructor(private resourcesLimitsService: ResourcesLimitService) {
  }

  ngOnInit() {
    this.resourcesLimitsService.getGlobalLimit().subscribe({
      next: (limit) => {
        if (limit) {
          this.globalResourcesLimit = limit;
        }
      },
      error: (err) => {}
    })
  }

  public save(): void {
    this.resourcesLimitsService.setGlobalLimit(this.globalResourcesLimit).subscribe({
      next: (result) => {},
      error: (err) => {}
    });
  }

}
