export class GlobalResourcesLimit {
    id?: number;
    memory?: number;
    cpu?: number;
    instancesNo?: number;
    containersNo?: number;
    limitType: 'GLOBAL' | 'DOMAIN' | 'USER';

}
