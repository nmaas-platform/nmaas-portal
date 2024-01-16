import {Domain} from './domain';
import {DomainApplicationStatePerDomain} from './domainapplicationstateperdomain';
import {User} from './user';

export class DomainGroup {
    public id: number = undefined;
    public name: string = undefined;
    public codename: string = undefined;
    public domains: Domain[] = [];
    public applicationStatePerDomain: DomainApplicationStatePerDomain[] = [];
    public accessUsers: User[] = [];
}
