import {WebhookType} from './webhook';

export class WebhookHistory {
    public id: number = undefined;
    public webhookEventId: number = undefined;
    public eventType: WebhookType = undefined;
    public domainCodename: string = undefined;
    public url: string = undefined;
    public requestBody: string = undefined;
    public responseBody: string = undefined;
    public responseStatus: number = undefined;
    public executionTimestamp: Date = undefined;
}
