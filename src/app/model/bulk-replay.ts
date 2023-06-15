export class BulkReplay {
    public successful: boolean;
    public created: boolean;
    public details: Map<string, string>;
    public type: BulkType;
}

export enum BulkType {
    DOMAIN= 'DOMAIN',
    APPLICATION = 'APPLICATION',
    USER = 'USER',
}
