import { ClusterDeployment , ClusterExtNetwork, ClusterIngress} from './cluster'; 


export class ClusterManager {
    public id: number;
    public name: string;
    public codename: string;
    public description: string;
    public creationDate: Date;  
    public modificationDate: Date;
    public clusterConfigFile: string;
    public pathConfigFile: string;
    public ingress: ClusterIngress;
    public deployment: ClusterDeployment;
    public externalNetworks: ClusterExtNetwork[]
    public domainNames: string[];
    public state : string;
    public currentStateSince: Date;
    public contactEmail: string;
}

export class RemoteClusterBaseDto {
    public id:number;
    public name:string;
    public codename:string;
    public state: string;
}
