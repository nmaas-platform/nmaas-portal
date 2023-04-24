import {User} from './user';
import {BulkReplay} from './bulk-replay';

export class BulkDeployment {
    public id: number;
    public creationDate: Date;
    public creator: User;
    public bulks: BulkReplay[] = [];
    public state: BulkDeploymentState;
}

export enum BulkDeploymentState {
    PROCESSING,
    FINISHED
}
