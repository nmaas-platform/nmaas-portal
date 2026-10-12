import {BundleDescription} from './bundle-description';

export class BundleBasic {
    name: string;
    codeName: string;
    descriptions: BundleDescription[];
    apps: number[];

    constructor(name: string,
                codename:string,
                descriptions: BundleDescription[],
                apps: number[]
    ) {
        this.name = name;
        this.codeName = codename;
        this.descriptions = descriptions;
        this.apps = apps;
    }
}
