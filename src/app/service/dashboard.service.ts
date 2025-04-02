import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppConfigService} from './appconfig.service';
import {GenericDataService} from './genericdata.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService extends GenericDataService {

  constructor(http: HttpClient, appConfig: AppConfigService) {
    super(http, appConfig);
  }

  public getAdmin() {
    return this.get(this.appConfig.getApiUrl() + '/dashboard/admin')
  }

  public getDomainAdmin(domainId?: number) {
    return this.get(this.appConfig.getApiUrl() + '/dashboard/domain/' + domainId)
  }
}
