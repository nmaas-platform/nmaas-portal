import {Injectable} from '@angular/core';
import {GenericDataService} from './genericdata.service';
import {HttpClient} from '@angular/common/http';
import {AppConfigService} from './appconfig.service';
import {PodLogs} from '../model/pod-logs';
import {Observable} from 'rxjs';
import {PodInfo} from '../model/podinfo';

@Injectable({
  providedIn: 'root'
})
export class AppLogsService extends GenericDataService {

  constructor(http: HttpClient, appConfig: AppConfigService) {
    super(http, appConfig);
  }

  public getLogsFromPod(appInstanceId: number, podName: string): Observable<PodLogs> {
    return this.http.get<PodLogs>(`${this.getUrl()}/${appInstanceId}/pods/${podName}`)
  }

  public getPodNames(appInstanceId: number): Observable<PodInfo[]> {
    return this.http.get<PodInfo[]>(`${this.getUrl()}/${appInstanceId}/pods`)
  }

  private getUrl(): string {
    return this.appConfig.getApiUrl() + '/apps/logs';
  }
}
