import {Injectable} from '@angular/core';
import {Application} from '../../model/application';
import {ApplicationBase} from '../../model/application-base';
import {HttpClient} from '@angular/common/http';
import {AppConfigService} from '../../service';

@Injectable({
    providedIn: 'root'
})
export class AppdeploymentService {

    private selectedApp: ApplicationBase = undefined;

    public result: any = [];


    constructor(private http: HttpClient,
                private appConfig: AppConfigService) {
    }


    setSelectedApp(app: ApplicationBase) {
        this.selectedApp = app;
    }

    getSelectedApp() {return this.selectedApp;}

    protected getUrl(): string {
        return this.appConfig.getApiUrl() + '/csv/upload/';
    }

    public uploadApplicationFile(file: File) {
        let formParams = new FormData();
        formParams.append('file', file);
        return this.http.post(this.getUrl() + 'app', formParams);
    }

}
