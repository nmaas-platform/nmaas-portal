export class BulkReplay {
    public successful: boolean;
    public createdInfo: string;
    public details: Map<string, string>;
    public type: BulkType;
}

export enum BulkType {
    DOMAIN= 'DOMAIN',
    USER = 'USER',
    APPLICATION = 'APPLICATION'
}
