import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {GenericDataService} from './genericdata.service';

import {HttpClient, HttpParams} from '@angular/common/http'
import {AppConfigService} from './appconfig.service';

import {Id} from '../model';
import {Domain} from '../model/domain';
import {User} from '../model';
import {DomainGroup} from '../model/domaingroup';

@Injectable({
  providedIn: 'root',
})
export class DomainService extends GenericDataService {

  protected url: string;

  private updateRequiredFlag: boolean;

  constructor(http: HttpClient, appConfig: AppConfigService) {
    super(http, appConfig);
    this.updateRequiredFlag = false;
    this.url = this.appConfig.getApiUrl() + '/domains/';
  }

  public getGlobalDomainId(): number {
    return this.appConfig.getNmaasGlobalDomainId();
  }

  public getGlobalDomain(): Observable<Domain> {
    return this.getOne(this.getGlobalDomainId());
  }

  public getAll(): Observable<Domain[]> {
    return this.get<Domain[]>(this.url);
  }

  public getOne(domainId: number): Observable<Domain> {
    return this.get<Domain>(this.url + domainId);
  }

  public add(domain: Domain): Observable<Id> {
    return this.post<Domain, Id>(this.url, domain);
  }

  public update(domain: Domain): Observable<any> {
    return this.put<Domain, Id>(this.url + domain.id, domain);
  }

  public updateTechDetails(domain: Domain): Observable<any> {
    return this.patch<Domain, Id>(this.url + domain.id, domain)
  }

  public updateDcnConfigured(domain: Domain): Observable<any> {
    return this.patch<Domain, Id>(this.url + domain.id + '/dcn?configured=' + domain.domainDcnDetails.dcnConfigured, null);
  }

  public updateDomainState(domain: Domain): Observable<any> {
    return this.patch<Domain, Id>(this.url + domain.id + '/state?active=' + !domain.active, null);
  }

  public remove(domainId: number, softRemove?: boolean): Observable<any> {
    let params = new HttpParams()
    if (softRemove !== undefined) {
      params = params.append("softRemove", softRemove.toString())
    }
    return this.http.delete(this.url + domainId, {params})
  }

  public getMyDomains(): Observable<Domain[]> {
    return this.get<Domain[]>(this.url + 'my');
  }

  public getUsers(domainId: number): Observable<User[]> {
    return this.get<User[]>(this.url + 'users');
  }

  public setUpdateRequiredFlag(flag: boolean) {
    this.updateRequiredFlag = flag;
  }

  public shouldUpdate(): boolean {
    return this.updateRequiredFlag;
  }

  // GROUPS
  public getAllDomainGroups(): Observable<DomainGroup[]> {
    return this.get<DomainGroup[]>(this.url + 'group');
  }

  public getDomainGroup(domainGroupId: number): Observable<DomainGroup> {
    return this.get<DomainGroup>(this.url + 'group/' + domainGroupId);
  }

  public deleteDomainGroup(domainGroupId: number): Observable<void> {
    return this.delete<void>(this.url + 'group/' + domainGroupId);
  }

  public addDomainsToGroup(groupCodeName: string, domainIds: number[]): Observable<DomainGroup> {
    return this.post(this.url + 'group/' + groupCodeName, domainIds);
  }

  public deleteDomainFromGroup(groupId: number, domainId: number): Observable<DomainGroup> {
    return this.patch(this.url + 'group/' + groupId, domainId);
  }

  public createDomainGroup(domainGroup: DomainGroup): Observable<Id> {
    return this.post(this.url + 'group', domainGroup);
  }

  public updateDomainGroup(domainGroup: DomainGroup, id: number): Observable<Id> {
    return this.put(this.url + 'group/' + id, domainGroup);
  }

}
