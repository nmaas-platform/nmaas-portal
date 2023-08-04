import {BulkDeploymentState} from './bulk-deployment';

export class BulkReplay {
    public state: BulkDeploymentState;
    public created: boolean;
    public details: Map<string, string>;
    public type: BulkType;
}

export enum BulkType {
    DOMAIN= 'DOMAIN',
    APPLICATION = 'APPLICATION',
    USER = 'USER',
}

