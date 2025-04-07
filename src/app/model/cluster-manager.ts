

export class ClusterManager {
    public id: number;
    public name: string;
    public codename: string;
    public description: string;
    public creationDate: string;  // Możesz użyć Date, ale JSON zazwyczaj zwraca string
    public modificationDate: string;
    public clusterConfigFile: string;
    public pathConfigFile: string;
}