export class Webhook {

    public id: number = undefined;
    public name: string = undefined;
    public targetUrl: string = undefined;
    public tokenValue: string = undefined;
    public authorizationHeader: string = undefined;
    public eventType: WebhookType = undefined;
}

export enum WebhookType {
    DOMAIN_CREATION = "DOMAIN_CREATION",
    APPLICATION_DEPLOYMENT = "APPLICATION_DEPLOYMENT",
    USER_ASSIGNMENT = "USER_ASSIGNMENT",
    DOMAIN_GROUP_CHANGE = "DOMAIN_GROUP_CHANGE",
}