import { Injectable } from '@angular/core';
import {GenericDataService} from './genericdata.service';
import {HttpClient} from '@angular/common/http';
import {AppConfigService} from './appconfig.service';
import {Observable} from 'rxjs';
import {GlobalResourcesLimit} from '../model/global-resources-limit';

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

  setGlobalLimit(limit: GlobalResourcesLimit): Observable<GlobalResourcesLimit> {
    return this.http.post<GlobalResourcesLimit>(`${this.uri}/global`, limit);
  }
}
