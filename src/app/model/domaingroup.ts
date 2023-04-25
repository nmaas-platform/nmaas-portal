import {Domain} from './domain';

export class DomainGroup {
    public id: number = undefined;
    public name: string = undefined;
    public codename: string = undefined;
    public domains: Domain[] = [];
}
