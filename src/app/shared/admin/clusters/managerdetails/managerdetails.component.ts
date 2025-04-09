import { Component, OnInit } from '@angular/core';
import { ClusterManagerService } from '../../../../service/cluster-manager.service';
import { ClusterManager } from '../../../../model/cluster-manager';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '../../../common/basecomponent/base.component';
import { ClusterExtNetwork, IngressCertificateConfigOption, IngressControllerConfigOption, IngressResourceConfigOption, NamespaceConfigOption } from '../../../../model/cluster';
import { DatePipe } from '@angular/common';
import { ComponentMode } from '../../../common/componentmode';

@Component({
  selector: 'app-manager-details',
  templateUrl: './managerdetails.component.html',
  styleUrl: './managerdetails.component.css'
})
export class ClusterManagerDetailsComponent extends BaseComponent implements OnInit  {

  public cluster: ClusterManager ;
  public cluterId;
  public error = "";

    controllerConfigOption: Map<string, IngressControllerConfigOption> = new Map<string, IngressControllerConfigOption>();

    resourceConfigOption: Map<string, IngressResourceConfigOption> = new Map<string, IngressResourceConfigOption>();

    namespaceConfigOption: Map<string, NamespaceConfigOption> = new Map<string, NamespaceConfigOption>();

    certificateConfigOption: Map<string, IngressCertificateConfigOption> = new Map<string, IngressCertificateConfigOption>();


  constructor(private clusterService: ClusterManagerService,
                    public router: Router,
                    private route: ActivatedRoute,
                    private datePipe: DatePipe,
                    
  ) {
    super();
    this.initializeMaps();
  }

  public ngOnInit() {
    this.route.params.subscribe(params => {
        this.cluterId = +params['id'];

        this.clusterService.getClusterDetails(this.cluterId).subscribe(result => {
          console.log(result);
          this.cluster = result;
        } )
    })
  }

 public sendCluster(event: any) {
    console.log(event);
    const file = event.files[0];
    const view = new ClusterManager();
    view.name = "test"
    view.description="testest"
    this.clusterService.sendCluster(file, view).subscribe(result => { 
        console.log(result);
    }
    )
    }

    private initializeMaps() {
        this.resourceConfigOption.set('Do nothing', IngressResourceConfigOption.NOT_USED);
        this.resourceConfigOption.set('Deploy new resource from the definition in the application chart', IngressResourceConfigOption.DEPLOY_FROM_CHART);
        this.controllerConfigOption.set('Use existing', IngressControllerConfigOption.USE_EXISTING);
        this.controllerConfigOption.set('Deploy new controller from chart repository', IngressControllerConfigOption.DEPLOY_NEW_FROM_REPO);
        this.controllerConfigOption.set('Deploy new controller from local chart archive', IngressControllerConfigOption.DEPLOY_NEW_FROM_ARCHIVE);
        this.namespaceConfigOption.set('Use default namespace', NamespaceConfigOption.USE_DEFAULT_NAMESPACE);
        this.namespaceConfigOption.set('Use domain namespace', NamespaceConfigOption.USE_DOMAIN_NAMESPACE);
        this.namespaceConfigOption.set('Create namespace', NamespaceConfigOption.CREATE_NAMESPACE);
        this.certificateConfigOption.set('Use my own wildcard certificate', IngressCertificateConfigOption.USE_WILDCARD);
        this.certificateConfigOption.set('Generate LetsEncrypt certificates automatically', IngressCertificateConfigOption.USE_LETSENCRYPT);
    }

    public getKeys(map) {
        return Array.from(map.keys());
    }

    public removeNetwork(id) {
            this.cluster.externalNetworks.splice(
                this.cluster.externalNetworks.findIndex(
                    function (i) {
                        return i.id = id;
                    }), 1);
    }
    
    public addNetwork() {
            const newobj: ClusterExtNetwork = new ClusterExtNetwork();
            this.cluster.externalNetworks.push(newobj);
    }

    public formatDate(date: Date) {
        return  this.datePipe.transform(date, 'dd-MM-yyyy HH:mm');
    }

    public submit(): void {
        console.log(this.cluster);
        this.clusterService.updateCluster(this.cluster).subscribe(result => {
            console.log(result);
            this.cluster = result;
        });
    }

}
