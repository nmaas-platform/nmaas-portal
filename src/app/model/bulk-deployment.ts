import {User} from './user';
import {BulkResponse, BulkType} from './bulk-response';

export class BulkDeployment {
    public id: number;
    public creationDate: Date;
    public creator: User;
    public entries: BulkResponse[] = [];
    public state: BulkDeploymentState;
    public type: BulkType;
    public details: Map<string, string>;
}

export enum BulkDeploymentState {
    PENDING= 'PENDING',
    PROCESSING= 'PROCESSING',
    COMPLETED= 'COMPLETED',
    FAILED= 'FAILED',
    PARTIALLY_FAILED= 'PARTIALLY_FAILED'
}
