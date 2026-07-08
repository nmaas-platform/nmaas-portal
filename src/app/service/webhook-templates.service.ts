import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppConfigService} from './appconfig.service';
import {GenericDataService} from './genericdata.service';
import {WebhookType} from '../model/webhook';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class WebhookTemplatesService extends GenericDataService {

    protected url: string;

    constructor(http: HttpClient, appConfig: AppConfigService) {
        super(http, appConfig);
        this.url = this.appConfig.getApiUrl() + '/webhook-templates';
    }

    public getVariables(eventType: WebhookType) {
        return this.http.get<Set<string>>(this.url + '/variables/' + eventType.valueOf());
    }

    public getDefaultTemplate(eventType: WebhookType): Observable<string> {
        return this.http.get(this.url + '/default/' + eventType.valueOf(),
            {responseType: 'text'});
    }
}
