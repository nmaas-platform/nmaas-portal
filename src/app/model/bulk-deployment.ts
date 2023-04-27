import {User} from './user';
import {BulkReplay, BulkType} from './bulk-replay';

export class BulkDeployment {
    public id: number;
    public creationDate: Date;
    public creator: User;
    public entries: BulkReplay[] = [];
    public state: BulkDeploymentState;
    public type: BulkType;
}

export enum BulkDeploymentState {
    PROCESSING,
    FINISHED
}
