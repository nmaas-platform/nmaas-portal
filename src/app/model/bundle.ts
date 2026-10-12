import {ApplicationBase} from './application-base';
import {BundleDescription} from './bundle-description';
import {BundleBasic} from './bundle-basic';

export class Bundle {
    id: number;
    name: string;
    codeName: string;
    descriptions: BundleDescription[];
    apps: ApplicationBase[];


    public toBundleBasic(): BundleBasic {
        return new BundleBasic(
            this.name,
            this.codeName,
            this.descriptions,
            this.apps.map(app => app.id)
        );
    }
}

