import {Injectable} from '@angular/core';
import {ApplicationBase} from '../../model/application-base';
import {HttpClient, HttpParams} from '@angular/common/http';
import {AppConfigService} from '../../service';
import {BulkResponse} from '../../model/bulk-response';
import {Observable} from 'rxjs';
import {BulkDeployment} from '../../model/bulk-deployment';

@Injectable({
    providedIn: 'root'
})
export class AppdeploymentService {

    private readonly DEPLOY_APP_KEY = 'APP_DEPLOYMENT'
    private readonly DEPLOY_APP_ID_KEY = 'APP_DEPLOYMENT_ID'

    private selectedApp: string = undefined;
    private selectedAppId: string = undefined;

    public result: BulkResponse[] = [];

    public bulk: BulkDeployment;


    constructor(private http: HttpClient,
                private appConfig: AppConfigService) {
        if (localStorage.getItem(this.DEPLOY_APP_KEY)) {
            this.selectedApp = localStorage.getItem(this.DEPLOY_APP_KEY)
            this.selectedAppId = localStorage.getItem(this.DEPLOY_APP_ID_KEY)
        } else {
            this.selectedApp = '';
            this.selectedAppId = '';
        }
    }

    setSelectedApp(app: ApplicationBase) {
        this.selectedApp = app.name;
        this.selectedAppId = `${app.id}`;
        localStorage.setItem(this.DEPLOY_APP_KEY, this.selectedApp)
        localStorage.setItem(this.DEPLOY_APP_ID_KEY, this.selectedAppId)
    }

    public getSelectedApp() {
        return this.selectedApp;
    }

    public getSelectedAppId() {
        return Number.parseInt(this.selectedAppId, 10);
    }

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

    public getBulksDomainDeploymentsOwner(): Observable<BulkDeployment[]> {
        return this.http.get<BulkDeployment[]>(this.getUrl() + 'domains/vl');
    }

    public getBulksAppDeployments(): Observable<BulkDeployment[]> {
        return this.http.get<BulkDeployment[]>(this.getUrl() + 'apps');
    }

    public getBulksAppDeploymentsOwner(): Observable<BulkDeployment[]> {
        return this.http.get<BulkDeployment[]>(this.getUrl() + 'apps/vl');
    }

    public getBulkDeployment(id: number): Observable<BulkDeployment> {
        return this.http.get<BulkDeployment>(this.getUrl() + id);
    }

    public getAppBulkDetails(id: number): Observable<Blob> {
        return this.http.get(this.getUrl() + `app/csv/${id}`, {responseType: 'blob'})
    }


    public removeBulkDeployment(id: number, removeAll: boolean): Observable<void> {
        let params = new HttpParams()
        params = params.append('removeAll', removeAll)
        return this.http.delete<void>(this.getUrl() + `${id}`, {params})
    }
}
