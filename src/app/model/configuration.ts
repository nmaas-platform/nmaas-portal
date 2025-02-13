export class Configuration {
    public id: number;
    public maintenance: boolean;
    public ssoLoginAllowed: boolean;
    public defaultLanguage: string;
    public testInstance: boolean;
    public sendAppInstanceFailureEmails: boolean;
    public registrationDomainSelectionEnabled: boolean;
    public bulkDomainsAllowForSsoAccounts: boolean;
    public bulkDomainsSendEmailForNewAccounts: boolean;
    public appInstanceFailureEmailList: string[] = [];
    public bulkDeploymentJobCron: string;
    public parallelDeploymentsLimit: number;
    public bulkDeploymentQueueRefresh: number;
}
