import {DomainDcnDetails} from './domaindcndetails';
import {DomainTechDetails} from './domaintechdetails';
import {DomainApplicationStatePerDomain} from './domainapplicationstateperdomain';
import {DomainGroup} from './domaingroup';
import {KeyValue} from './key-value';
import { DomainAnnotation } from './domain-annotation';
import { ClusterManager } from './cluster-manager';

export class Domain {
  public id: number = undefined;
  public name: string = undefined;
  public codename: string = undefined;
  public limitUsage: number = undefined;
  public active: boolean = undefined;
  public domainDcnDetails: DomainDcnDetails = new DomainDcnDetails();
  public domainTechDetails: DomainTechDetails = new DomainTechDetails();
  public applicationStatePerDomain: DomainApplicationStatePerDomain[] = [];
  public groups: DomainGroup[] = [];
  public deleted: boolean;
  public annotations: DomainAnnotation[] = [];
  public clusters: ClusterManager[] = [];

}
