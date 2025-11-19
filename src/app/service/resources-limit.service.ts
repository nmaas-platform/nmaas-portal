import { Injectable } from '@angular/core';
import {GenericDataService} from './genericdata.service';
import {HttpClient} from '@angular/common/http';
import {AppConfigService} from './appconfig.service';
import {Observable} from 'rxjs';
import {GlobalResourcesLimit} from '../model/global-resources-limit';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ResourcesLimitService extends GenericDataService {

  protected uri: string;

  constructor(http: HttpClient, appConfig: AppConfigService) {
    super(http, appConfig);
    this.uri = this.appConfig.getApiUrl() + '/resources-limits';
  }

  getGlobalLimit(): Observable<GlobalResourcesLimit> {
    return this.http.get<GlobalResourcesLimit>(`${this.uri}/global`);
  }

  getLimits(): Observable<GlobalResourcesLimit[]> {
    return this.http.get<GlobalResourcesLimit[]>(this.uri);
  }
  getDomainLimit(domainId: number): Observable<GlobalResourcesLimit> {
    return this.http.get<GlobalResourcesLimit>(`${this.uri}/domain/${domainId}`);
  }

  setGlobalLimit(limit: GlobalResourcesLimit): Observable<GlobalResourcesLimit> {
    return this.http.post<GlobalResourcesLimit>(`${this.uri}/global`, limit);
  }

  setDomainLimit(domainId: number, limit: GlobalResourcesLimit): Observable<any> {
    return this.http.post(this.uri, {
      limitType: 'DOMAIN',
      domain: { id: domainId },
      ...limit
    });
  }
  updateDomainLimit(limit: GlobalResourcesLimit): Observable<any> {
    return this.http.put(`${this.uri}/${limit.id}`, limit);
  }
  deleteDomainLimit(limitId: number): Observable<any> {
    return this.http.delete(`${this.uri}/${limitId}`);
  }

}
