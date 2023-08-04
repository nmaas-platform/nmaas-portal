import {Injectable, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Application} from '../../model/application';
import {ApplicationBase} from '../../model/application-base';
import {HttpClient} from '@angular/common/http';
import {AppConfigService} from '../../service';
import {BulkReplay} from '../../model/bulk-replay';
import {Observable} from 'rxjs';
import {BulkDeployment} from '../../model/bulk-deployment';

@Injectable({
    providedIn: 'root'
})
export class AppdeploymentService {

    private readonly DEPLOY_APP_KEY = 'APP_DEPLOYMENT'

    private selectedApp: string = undefined;

    public result: BulkReplay[] = [];

    public bulk: BulkDeployment;


    constructor(private http: HttpClient,
                private appConfig: AppConfigService) {
        console.log(localStorage.getItem(this.DEPLOY_APP_KEY))
        if (localStorage.getItem(this.DEPLOY_APP_KEY)) {
            this.selectedApp = localStorage.getItem(this.DEPLOY_APP_KEY)
        } else {
            this.selectedApp = '';
        }
    }

    setSelectedApp(app: ApplicationBase) {
        this.selectedApp = app.name;
        localStorage.setItem(this.DEPLOY_APP_KEY, this.selectedApp)
    }

    getSelectedApp() {return this.selectedApp; }

    protected getUrl(): string {
        return this.appConfig.getApiUrl() + '/bulks/';
    }

    public uploadApplicationFile(file: File, name: string): Observable<BulkDeployment> {
        const formParams = new FormData();
        formParams.append('file', file);
        formParams.append('appName', name)
        return this.http.post<BulkDeployment>(this.getUrl() + 'apps', formParams);
    }

    public uploadUserDomainFile(file: File): Observable<BulkDeployment> {
        const formParams = new FormData();
        formParams.append('file', file);
        return this.http.post<BulkDeployment>(this.getUrl() + 'domains', formParams);
    }

    public getBulksDomainDeployments(): Observable<BulkDeployment[]> {
        return this.http.get<BulkDeployment[]>(this.getUrl() + 'domains');
    }
    public getBulksAppDeployments(): Observable<BulkDeployment[]> {
        return this.http.get<BulkDeployment[]>(this.getUrl() + 'apps');
    }

    public getBulkDeployment(id: number): Observable<BulkDeployment> {
        return this.http.get<BulkDeployment>(this.getUrl() + id);
    }



}
