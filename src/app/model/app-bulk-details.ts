export class AppBulkDetails {
    public userName: string;
    public domainCodeName: string;
    public appName: string;
    public appInstanceName: string;
    public appVersion: string;
    public parameters: Map<string, string> = new Map<string, string>();
    public accessMethod: Map<string, string> = new Map<string, string>();
}
