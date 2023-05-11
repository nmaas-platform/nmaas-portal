import {DomainDcnDetails} from './domaindcndetails';
import {DomainTechDetails} from './domaintechdetails';
import {DomainApplicationStatePerDomain} from './domainapplicationstateperdomain';
import {DomainGroup} from './domaingroup';

export class Domain {
  public id: number = undefined;
  public name: string = undefined;
  public codename: string = undefined;
  public active: boolean = undefined;
  public domainDcnDetails: DomainDcnDetails = new DomainDcnDetails();
  public domainTechDetails: DomainTechDetails = new DomainTechDetails();
  public applicationStatePerDomain: DomainApplicationStatePerDomain[] = [];
  public groups: DomainGroup[] = [];
}
