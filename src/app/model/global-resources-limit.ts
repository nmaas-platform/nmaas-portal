export class GlobalResourcesLimit {
    id?: number;
    memory?: number;
    cpu?: number;
    instancesNo?: number;
    containersNo?: number;
    domain?: Domain;
    limitType: 'GLOBAL' | 'DOMAIN' | 'USER';
}
 export interface Domain {
    id: number
 }
