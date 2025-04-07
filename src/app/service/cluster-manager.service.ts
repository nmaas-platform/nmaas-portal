import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AppConfigService } from "./appconfig.service";
import { Observable } from "rxjs";
import { ClusterManager } from "../model/cluster-manager";

@Injectable({
    providedIn: 'root',
})
export class ClusterManagerService {

    protected url: string;


    constructor(private http: HttpClient, 
                private appConfig: AppConfigService) {
            this.url = this.appConfig.getApiUrl() + '/management/cluster';
    }

    public sendCluster(file: File, view: ClusterManager): Observable<ClusterManager> {
        const formParams = new FormData();
        formParams.append('file', file);
        formParams.append('data', new Blob([JSON.stringify(view)], { type: 'application/json' }));
        return this.http.post<ClusterManager>(this.url, formParams);
    }

    public getAllClusters(): Observable<ClusterManager[]> {
    return this.http.get<ClusterManager[]>(this.url + '/all');
    }

}