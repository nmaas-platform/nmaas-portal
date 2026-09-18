import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {AppConfigService} from './appconfig.service';
import {GenericDataService} from './genericdata.service';
import {Observable} from 'rxjs';
import {DomainGroupDashboardDto} from '../shared/group-admin-dashboard/model/domain-group-dashboard-dto';

@Injectable({
  providedIn: 'root'
})
export class DashboardService extends GenericDataService {

  constructor(http: HttpClient, appConfig: AppConfigService) {
    super(http, appConfig);
  }

  public getAdmin(startDate: string, endDate: string) {
    const params = new HttpParams()
        .set('startDate', startDate)
        .set('end', endDate);

    return this.http.get(this.appConfig.getApiUrl() + '/dashboard/admin', { params });
  }

  public getDomainAdmin(domainId?: number) {
    return this.get(this.appConfig.getApiUrl() + '/dashboard/domain/' + domainId)
  }
  public getGroupAdmin(groupId?: number):Observable<DomainGroupDashboardDto> {
    return this.get(this.appConfig.getApiUrl() + '/dashboard/group/' + groupId)
  }

  public getOperator() {
    return this.get(this.appConfig.getApiUrl() + '/dashboard/operator');
  }
}
