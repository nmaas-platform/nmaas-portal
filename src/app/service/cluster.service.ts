import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {GenericDataService} from './genericdata.service';

import { HttpClient } from '@angular/common/http'
import {AppConfigService} from './appconfig.service';

import {Cluster} from '../model/cluster';

@Injectable({
    providedIn: 'root',
})
export class ClusterService extends GenericDataService {

    protected url: string;

    constructor(http: HttpClient, appConfig: AppConfigService) {
        super(http, appConfig);

        this.url = this.appConfig.getApiUrl() + '/management/kubernetes';
    }

    public getCluster(): Observable<Cluster> {
        return this.get<Cluster>(this.url);
    }

}
