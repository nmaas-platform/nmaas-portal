import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AppConfigService} from './appconfig.service';
import {GenericDataService} from './genericdata.service';
import {Variable, VariableScope} from '../model/variable';

@Injectable({
    providedIn: 'root'
})
export class VariableService extends GenericDataService {

    protected url: string;

    constructor(http: HttpClient, appConfig: AppConfigService) {
        super(http, appConfig);
        this.url = this.appConfig.getApiUrl() + '/variables';
    }

    public getAll(scope: VariableScope = VariableScope.GLOBAL, domainId?: number): Observable<Variable[]> {
        const params: any = {scope: scope};
        if (domainId) {
            params['domainId'] = domainId;
        }
        return this.http.get<Variable[]>(this.url, {params});
    }

    public getEffective(domainId: number): Observable<Variable[]> {
        const params: any = {domainId: domainId};
        return this.http.get<Variable[]>(this.url + '/effective', {params});
    }

    public getOne(id: number): Observable<Variable> {
        return this.get<Variable>(this.url + '/' + id);
    }

    public resolve(name: string, domainId?: number): Observable<Variable> {
        const params: any = {name: name};
        if (domainId) {
            params['domainId'] = domainId;
        }
        return this.http.get<Variable>(this.url + '/resolve', {params});
    }

    public create(variable: Variable): Observable<number> {
        return this.post<Variable, number>(this.url, variable);
    }

    public update(variable: Variable): Observable<Variable> {
        return this.put<Variable, Variable>(this.url + '/' + variable.id, variable);
    }

    public remove(id: number) {
        return this.delete<void>(this.url + '/' + id);
    }

}
