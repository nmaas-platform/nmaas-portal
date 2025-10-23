import {AppInstance} from './app-instance';
import {ConfigWizardTemplate} from './configwizardtemplate';
import {AppInstanceState} from './app-instance-status';
import {Tag} from './tag';
import {DomainApplicationStatePerDomain} from './domainapplicationstateperdomain';
import {User} from './user';

export class AppInstanceExtended extends AppInstance {
    public appId: number;
    public appBaseId: number;
    public domainId: number;
    public appBaseName: string;
    public appLicense: string;
    public appLicenseUrl: string;
    public appWwwUrl: string;
    public appSourceUrl: string;
    public appIssuesUrl: string;
    public appNmaasDocumentationUrl: string;
    public applicationName: string;
    public applicationVersion: string;
    public descriptiveDeploymentId: string;
    public chartVersion: string;
    public ownerUsername: string;
    public configuration: string

    public autoUpgradesEnabled: boolean;
    public upgradePossible: boolean;
    public allowSshAccess: boolean;
    public configUpdateEnabled: boolean;
    public allowLogAccess: boolean;
    public configFileRepositoryRequired: boolean;

    public configWizardTemplate: ConfigWizardTemplate;
    public state: AppInstanceState;
    public tags: Tag[] = [];
    public applicationStatePerDomain: DomainApplicationStatePerDomain[] = [];
    public members: User[];

}
