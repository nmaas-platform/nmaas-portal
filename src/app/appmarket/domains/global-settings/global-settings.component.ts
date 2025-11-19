import { Component, OnInit } from '@angular/core';
import {GlobalResourcesLimit} from '../../../model/global-resources-limit';
import {ResourcesLimitService} from '../../../service/resources-limit.service';
import {ToastContainerComponent, ToastMode} from '../../../shared/toast-container/toast-container.component';



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

  constructor(private resourcesLimitsService: ResourcesLimitService,
              private toast: ToastContainerComponent) {
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
      next: (result) => {
        this.toast.show('TOAST.SUCCESS.GLOBAL_LIMIT', ToastMode.SUCCESS, 'TOAST.SUCCESS_HEADER')
      },
      error: (err) => {}
    });
  }

}
