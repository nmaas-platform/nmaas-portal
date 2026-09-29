import { Injectable } from '@angular/core';
import {GenericDataService} from './genericdata.service';
import {HttpClient, HttpParams} from '@angular/common/http';
import {AppConfigService} from './appconfig.service';
import {BundleBasic} from '../model/bundle-basic';
import {Bundle} from '../model/bundle';
import {Observable} from 'rxjs';
import { Page } from './page';

@Injectable({
  providedIn: 'root',
})
export class BundleService extends GenericDataService {

  constructor(http: HttpClient, appConfig: AppConfigService) {
    super(http, appConfig);
  }

  create(bundleRequest: BundleBasic): Observable<Bundle> {
    return this.http.post<Bundle>(this.appConfig.getApiUrl() + '/bundles', bundleRequest);
  }

  update(bundleRequest: BundleBasic, bundleId: number): Observable<BundleBasic> {
    return this.http.put<BundleBasic>(this.appConfig.getApiUrl() + '/bundles/' + bundleId, bundleRequest);
  }

  getAllByApplication(appid:number, page = 0, size = 10, sort = 'id,asc'): Observable<Page<BundleBasic>>{
    const params = new HttpParams()
        .set('page', page)
        .set('size', size)
        .set('sort', sort);
    return this.http.get<Page<BundleBasic>>(this.appConfig.getApiUrl() + '/bundles/application,' + appid, {params});
  }
  getAllByApplicationRaw(appid:number): Observable<Bundle[]>{
    return this.http.get<Bundle[]>(this.appConfig.getApiUrl() + '/bundles/application/' + appid + "/raw");
  }

  getAll(page = 0, size = 10, sort = 'id,asc', name:string = ""): Observable<Page<BundleBasic>>{
    const params = new HttpParams()
        .set('name', name)
        .set('page', page)
        .set('size', size)
        .set('sort', sort);
    return this.http.get<Page<BundleBasic>>(this.appConfig.getApiUrl() + '/bundles', {params});
  }

  getById(id:number):Observable<Bundle>{
    return this.http.get<Bundle>(this.appConfig.getApiUrl() + '/bundles/' + id);
  }
  isAppInBundle(id:number):Observable<boolean>{
    return this.http.get<boolean>(this.appConfig.getApiUrl() + '/bundles/exists/' + id);
  }
}
