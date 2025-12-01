import { HttpClient } from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import { AppConfigService } from './appconfig.service';
import { GenericDataService } from './genericdata.service';
import {Webhook, WebhookType} from '../model/webhook';
import { Id } from '../model';
import {WebhookHistory} from '../model/webhook-history';

@Injectable()
export class WebhookService extends GenericDataService {


  protected url: string;
  
    constructor(http: HttpClient, appConfig: AppConfigService) {
          super(http, appConfig);
          this.url = this.appConfig.getApiUrl() + '/webhooks';
    }


    public getAll(): Observable<Webhook[]> {
        return this.get<Webhook[]>(this.url);
    }

    public create(webhook: Webhook) {
        return this.post<Webhook, Id>(this.url, webhook);
    }

     public getOne(id: number) {
        return this.get<Webhook>(this.url + '/' + id);
    }

    public update(webhook: Webhook) {
        return this.put<Webhook, Webhook>(this.url + '/' + webhook.id, webhook);
    }

    public remove(id: number) {
        return this.delete<void>(this.url + '/' + id);
    }

    public getByDomain(domainId: number): Observable<Webhook[]> {
        return this.get<Webhook[]>(this.url + '/domain/' + domainId);
    }

    public getOneByDomain(domainId: number, id: number): Observable<Webhook> {
        return this.get<Webhook>(this.url + '/domain/' + domainId + '/' + id);
    }

    public createByDomain(domainId: number, webhook: Webhook) {
        return this.post<Webhook, Id>(this.url + '/domain/' + domainId, webhook);
    }

    public updateByDomain(domainId: number, webhook: Webhook) {
        return this.put<Webhook, Webhook>(this.url + '/domain/' + domainId + '/' + webhook.id, webhook);
    }

    public removeByDomain(domainId: number, id: number) {
        return this.delete<void>(this.url + '/domain/' + domainId + '/' + id);
    }

    // public getAllHistory() {
    //    return this.get<WebhookHistory[]>(this.appConfig.getApiUrl() + '/webhooks-history');
    // }
    getAllHistory(eventId?: number, eventType?: WebhookType, domainCodename?: string, from?: Date, to?: Date) {
        const params: any = {};
        if (eventId) {
            params['eventId'] = eventId;
        }
        if (eventType) {
            params['eventType'] = eventType;
        } if (domainCodename) {
            params['domainCodename'] = domainCodename;
        } if (from) {
            params['from'] = from.toISOString().split('.')[0];
        } if (to) { params['to'] = to.toISOString().split('.')[0];
        }
        return this.http.get<WebhookHistory[]>(this.appConfig.getApiUrl() + '/webhooks-history', {params});
    }
    public getOneHistory(id: number) {
        return this.get<WebhookHistory>(this.appConfig.getApiUrl() + '/webhooks-history/' + id );
    }

}
