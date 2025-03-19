import {Injectable} from '@angular/core';
import {GenericDataService} from './genericdata.service';
import {AppConfigService} from './appconfig.service';
import {Observable} from 'rxjs';
import {User} from '../model';
import {HttpClient} from '@angular/common/http';
import { UserRole } from '../model/userrole';


@Injectable({
  providedIn: 'root',
})
export class ProfileService extends GenericDataService {

  constructor(http: HttpClient, appConfig: AppConfigService) {
    super(http, appConfig)
  }

  public getOne(): Observable<User> {
    return this.http.get<User>(this.getProfileUrl() + 'user')
  }

  public getRoles(): Observable<UserRole[]> {
    return this.http.get<UserRole[]>(this.getProfileUrl() + 'user/roles')
  }

  protected getProfileUrl(): string {
      return this.appConfig.getApiUrl() + '/profile/'
  }
}
