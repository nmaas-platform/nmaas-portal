export class GlobalResourcesLimit {
    id?: number;
    memory?: number;
    cpu?: number;
    instancesNo?: number;
    containersNo?: number;
    domain?: Domain;
    domainGroup?: DomainGroup;
    limitType: 'GLOBAL' | 'DOMAIN' | 'DOMAIN_GROUP';
}
 export interface Domain {
    id: number
 }
export interface DomainGroup {
    id: number
}
