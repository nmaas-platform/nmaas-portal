import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {GenericDataService} from './genericdata.service';

import { HttpClient, HttpParams } from '@angular/common/http'
import {AppConfigService} from './appconfig.service';

import {Id} from '../model';
import {Domain} from '../model/domain';
import {User} from '../model';
import {DomainGroup} from '../model/domaingroup';
import { KeyValue } from '../model/key-value';
import { DomainAnnotation } from '../model/domain-annotation';
import { Page, PaginatorEvent } from './page';
import { PaginationService } from './pagination.service';

@Injectable({
  providedIn: 'root',
})
export class DomainService extends GenericDataService {

  protected url: string;

  protected urlGroups: string;

  private updateRequiredFlag: boolean;

  constructor(http: HttpClient, appConfig: AppConfigService, private paggination: PaginationService) {
    super(http, appConfig);
    this.updateRequiredFlag = false;
    this.url = this.appConfig.getApiUrl() + '/domains';
    this.urlGroups = this.appConfig.getApiUrl() + '/groups';
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

  public getAllBase(): Observable<Domain[]> {
    return this.get<Domain[]>(this.url + '/base');
  }

  public getAllPageable( paginatorEvent: PaginatorEvent, searchValue: string = ''): Observable<Page<Domain>> {
    
    const customFilters = {
      searchValue: searchValue
    };

    const params = this.paggination.getPaginationAndFilterParams(paginatorEvent, customFilters);

    return this.http.get<Page<Domain>>(this.url, {params});

    }

  public getAllBasePageable( paginatorEvent: PaginatorEvent, searchValue: string = ''): Observable<Page<Domain>> {  
      const customFilters = {
      searchValue: searchValue
    };

    const params = this.paggination.getPaginationAndFilterParams(paginatorEvent, customFilters);

    return this.http.get<Page<Domain>>(this.url + '/base', {params});

    }


  public getOne(domainId: number): Observable<Domain> {
    return this.get<Domain>(this.url + '/' + domainId);
  }

  public add(domain: Domain): Observable<Id> {
    return this.post<Domain, Id>(this.url, domain);
  }

  public update(domain: Domain): Observable<any> {
    return this.put<Domain, Id>(this.url + '/' + domain.id, domain);
  }

  public updateTechDetails(domain: Domain): Observable<any> {
    return this.patch<Domain, Id>(this.url + '/' + domain.id, domain)
  }

  public updateDcnConfigured(domain: Domain): Observable<any> {
    return this.patch<Domain, Id>(this.url  + '/' + domain.id + '/dcn?configured=' + domain.domainDcnDetails.dcnConfigured, null);
  }

  public updateDomainState(domain: Domain): Observable<any> {
    return this.patch<Domain, Id>(this.url + '/' + domain.id + '/state?active=' + !domain.active, null);
  }

  public remove(domainId: number, softRemove?: boolean): Observable<any> {
    let params = new HttpParams()
    if (softRemove !== undefined) {
      params = params.append("softRemove", softRemove.toString())
    }
    return this.http.delete(this.url + '/' + domainId, {params})
  }

  public getMyDomains(): Observable<Domain[]> {
    return this.get<Domain[]>(this.url + '/my');
  }

  public getMyDomainsFiltered(paginatorEvent: PaginatorEvent, searchValue: string = ''): Observable<Domain[]> {
    const customFilters = {
      searchValue: searchValue
    };

    const params = this.paggination.getPaginationAndFilterParams(paginatorEvent, customFilters);

    return this.http.get<Domain[]>(this.url + '/my', {params});
  }

  public getUsers(domainId: number): Observable<User[]> {
    return this.get<User[]>(this.url + '/users');
  }

  public setUpdateRequiredFlag(flag: boolean) {
    this.updateRequiredFlag = flag;
  }

  public shouldUpdate(): boolean {
    return this.updateRequiredFlag;
  }

  // GROUPS
  public getAllDomainGroups(): Observable<DomainGroup[]> {
    return this.get<DomainGroup[]>(this.urlGroups);
  }
  public getAllDomainGroupsPageable( paginatorEvent: PaginatorEvent, searchValue: string = ''): Observable<Page<DomainGroup>> {
    const customFilters = {
      searchValue: searchValue
    };

    const params = this.paggination.getPaginationAndFilterParams(paginatorEvent, customFilters);

    return this.http.get<Page<DomainGroup>>(this.urlGroups + '/', {params});

  }

  public getDomainGroup(domainGroupId: number): Observable<DomainGroup> {
    return this.get<DomainGroup>(this.urlGroups + '/' + domainGroupId);
  }

  public deleteDomainGroup(domainGroupId: number): Observable<void> {
    return this.delete<void>(this.urlGroups + '/' + domainGroupId);
  }

  public addDomainsToGroup(groupCodeName: string, domainIds: number[]): Observable<DomainGroup> {
    return this.post(this.urlGroups + '/' + groupCodeName, domainIds);
  }

  public deleteDomainFromGroup(groupId: number, domainId: number): Observable<DomainGroup> {
    return this.patch(this.urlGroups + '/' + groupId, domainId);
  }

  public createDomainGroup(domainGroup: DomainGroup): Observable<Id> {
    return this.post(this.urlGroups , domainGroup);
  }

  public updateDomainGroup(domainGroup: DomainGroup, id: number): Observable<Id> {
    return this.put(this.urlGroups+ "/" + id, domainGroup);
  }

  public updateDomainGroupManagers(managers: User[], id: number): Observable<DomainGroup> {
    return this.put(this.urlGroups + '/' + id + "/members", managers);
  }

  public getAnnotations(): Observable<DomainAnnotation[]> {
    return this.get<DomainAnnotation[]>(this.url + '/annotations')
  }

  public addAnnotations(annotation: KeyValue): Observable<void> {
    return this.post(this.url + '/annotations', annotation)
  }

  public deleteAnnotation(id: number) : Observable<void> {
    return this.delete(`${this.url}/annotations/${id}`)
  }

  public updateAnnotation(annotation: DomainAnnotation): Observable<void> {
    return this.put(`${this.url}/annotations/${annotation.id}`, annotation)
  }
}
