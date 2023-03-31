import {Injectable} from '@angular/core';
import {Application} from '../../model/application';
import {ApplicationBase} from '../../model/application-base';
import {HttpClient} from '@angular/common/http';
import {AppConfigService} from '../../service';
import {BulkReplay} from '../../model/bulk-replay';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AppdeploymentService {

    private selectedApp: ApplicationBase = undefined;

    public result: BulkReplay[] = [];


    constructor(private http: HttpClient,
                private appConfig: AppConfigService) {
    }


    setSelectedApp(app: ApplicationBase) {
        this.selectedApp = app;
    }

    getSelectedApp() {return this.selectedApp;}

    protected getUrl(): string {
        return this.appConfig.getApiUrl() + '/bulks/';
    }

    public uploadApplicationFile(file: File): Observable<BulkReplay[]> {
        const formParams = new FormData();
        formParams.append('file', file);
        return this.http.post<BulkReplay[]>(this.getUrl() + 'apps', formParams);
    }

    public uploadUserDomainFile(file: File): Observable<BulkReplay[]> {
        const formParams = new FormData();
        formParams.append('file', file);
        return this.http.post<BulkReplay[]>(this.getUrl() + 'users', formParams);
    }

}
