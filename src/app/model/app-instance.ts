import {User} from './user';
import {AppInstanceState} from './app-instance-status';
import {ConfigWizardTemplate} from './configwizardtemplate';
import {ServiceAccessMethod} from './service-access-method';
import {AppConfigRepositoryAccessDetails} from './app-config-repository-access-details';

export class AppInstanceRequest {

  public applicationId: number = undefined;
  public name: string = undefined;
  public autoUpgradesEnabled: boolean = false;

  constructor(applicationId?: number, name?: string, autoUpgradesEnabled?: boolean) {
    this.applicationId = applicationId;
    this.name = name;
    this.autoUpgradesEnabled = autoUpgradesEnabled;
  }

}

export class AppInstanceUpgradeInfo {
  public applicationId: number = undefined;
  public applicationVersion: String = undefined;
  public helmChartVersion: String = undefined;
}

export class AppInstance {

  public id: number = undefined;
  public domainId: number = undefined;
  public applicationId: number = undefined;
  public applicationName: string = undefined;
  public applicationVersion: string = undefined;
  public internalId: string = undefined;
  public name: string = undefined;
  public createdAt: Date = undefined;
  public owner: User = undefined;
  public autoUpgradesEnabled: boolean = false;
  public upgradePossible: boolean = false;
  public configuration: string = undefined;
  public state: AppInstanceState = undefined;
  public userFriendlyState = undefined;
  public serviceAccessMethods: ServiceAccessMethod[] = undefined;
  public configWizardTemplate: ConfigWizardTemplate = undefined;
  public configUpdateWizardTemplate: ConfigWizardTemplate = undefined;
  public descriptiveDeploymentId: string = undefined;
  public appConfigRepositoryAccessDetails: AppConfigRepositoryAccessDetails = undefined;
  public members: User[] = []
  public upgradeInfo: AppInstanceUpgradeInfo = undefined;
}
