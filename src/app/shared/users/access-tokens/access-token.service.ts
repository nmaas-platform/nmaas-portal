import {Observable} from 'rxjs';
import {AccessToken} from './access-token';
import {Injectable} from '@angular/core';
import {GenericDataService} from '../../../service/genericdata.service';
import {HttpClient} from '@angular/common/http';
import {AppConfigService} from '../../../service';

@Injectable({
    providedIn: 'root'
})
export class AccessTokenService extends GenericDataService {

    constructor(http: HttpClient, appConfig: AppConfigService) {
        super(http, appConfig);
    }

    public getAll(): Observable<AccessToken[]> {
        return this.http.get<AccessToken[]>(this.getUrl())
    }

    public invalidate(id: number): Observable<void> {
        return this.http.put<void>(`${this.getUrl()}/${id}`, '')
    }

    public createToken(tokenName: string): Observable<AccessToken> {
        return this.http.post<AccessToken>(this.getUrl(), tokenName)
    }

    private getUrl(): string {
        return this.appConfig.getApiUrl() + '/tokens';
    }
}
