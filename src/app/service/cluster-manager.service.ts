import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AppConfigService } from "./appconfig.service";
import { Observable } from "rxjs";
import {ClusterManager, RemoteClusterBaseDto} from '../model/cluster-manager';

@Injectable({
    providedIn: 'root',
})
export class ClusterManagerService {

    protected url: string;


    constructor(private http: HttpClient, 
                private appConfig: AppConfigService) {
            this.url = this.appConfig.getApiUrl() + '/management/cluster';
    }

    public sendCluster(view: ClusterManager, file?: File, createNamespace: boolean = false,
                       secretNamespace?: string, secretName?: string): Observable<ClusterManager> {
        const formParams = new FormData();
        formParams.append('data', new Blob([JSON.stringify(view)], { type: 'application/json' }));
        if (file) {
            formParams.append('file', file);
            formParams.append('createNamespace', createNamespace.toString());
        }
        if (secretName && secretName) {
            formParams.append('createNamespace', createNamespace.toString());
            formParams.append('secretName', secretName);
            formParams.append('secretNamespace', secretNamespace);
        }
        return this.http.post<ClusterManager>(this.url, formParams);
    }

    public getAllClusters(): Observable<ClusterManager[]> {
    return this.http.get<ClusterManager[]>(this.url + '/all');
    }

    public getClustersBase(): Observable<RemoteClusterBaseDto[]> {
        return this.http.get<RemoteClusterBaseDto[]>(this.url + '/base');
    }

    public getClusterDetails(id: number): Observable<ClusterManager> {
        return this.http.get<ClusterManager>(`${this.url}/${id}`);
    }

    public updateCluster(cluster: ClusterManager): Observable<ClusterManager> {
        return this.http.put<ClusterManager>(`${this.url}/${cluster.id}`, cluster);
    }

     public deleteCluster(id: number): Observable<void> {
        return this.http.delete<void>(this.url + '/' + id);
    }

    public readClusterFile(view: ClusterManager, file?: File, secretNamespace?: string, secretName?: string): Observable<ClusterManager> {
        const formParams = new FormData();
        formParams.append('data', new Blob([JSON.stringify(view)], { type: 'application/json' }));

        if (file) {
            formParams.append('file', file);
        }
        if (secretName && secretName) {
            formParams.append('secretName', secretName);
            formParams.append('secretNamespace', secretNamespace);
        }

        return this.http.post<ClusterManager>(this.url + '/read', formParams);
    }

    public getClustersInDomain(domainId: number): Observable<ClusterManager[]> {
        return this.http.get<ClusterManager[]>(`${this.url}/domain/${domainId}`);
    }

    public refreshCluster(id: number): Observable<ClusterManager> {
       return this.http.post<ClusterManager>(`${this.url}/${id}/status`, {});
    }

}
