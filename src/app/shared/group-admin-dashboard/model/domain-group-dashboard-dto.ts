export class DomainGroupDashboardDto {
    userLogins: UserLoginsDto[];
    domains: DomainDto[];
}

class UserLoginsDto {
    userName: string;
    lastLogin: Date;
    deploymentCount: number = 0;
}


class DomainDto {
    name: string;
    applicationDeployed: ApplicationDeployedDto[];
    applicationUpgradeStatus: DomainAppInstanceDto[];
}

class ApplicationDeployedDto {
    userName: string;
    count: number;
}

class DomainAppInstanceDto {
    appName: string;
    instanceName: string;
    appId: number;
    baseAppId: number;
    appVersion: string;
    upgradePossible: boolean;
}
export class GroupAppInstanceDto extends DomainAppInstanceDto{
    domainName?: string;
}
