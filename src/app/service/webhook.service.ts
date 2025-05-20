import { HttpClient } from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import { AppConfigService } from './appconfig.service';
import { GenericDataService } from './genericdata.service';
import { Webhook } from '../model/webhook';
import { Id } from '../model';

@Injectable()
export class WebhookService extends GenericDataService {


  protected url: string;
  
    constructor(http: HttpClient, appConfig: AppConfigService) {
          super(http, appConfig);
          this.url = this.appConfig.getApiUrl() + '/webhooks';
    }


    public getAll() : Observable<Webhook[]> {
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

}
