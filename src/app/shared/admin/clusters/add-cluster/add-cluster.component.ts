import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { Cluster, ClusterExtNetwork, IngressCertificateConfigOption, IngressControllerConfigOption, IngressResourceConfigOption, NamespaceConfigOption } from '../../../../model/cluster';
import { ClusterManager } from '../../../../model/cluster-manager';
import { ClusterManagerService } from '../../../../service/cluster-manager.service';
import { DomainService } from '../../../../service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../../auth/auth.service';
import { UserDataService } from '../../../../service/userdata.service';

@Component({
  selector: 'app-add-cluster',
  templateUrl: './add-cluster.component.html',
  styleUrl: './add-cluster.component.css'
})
export class AddClusterComponent implements OnInit {

  public steps: MenuItem[];
  public activeStepIndex = 0;
  public translateUpdate: any;

  public kubernetesFile: string;
  public domains = [];
  public assignedDomain: boolean = false;

  controllerConfigOption: Map<string, IngressControllerConfigOption> = new Map<string, IngressControllerConfigOption>();
  resourceConfigOption: Map<string, IngressResourceConfigOption> = new Map<string, IngressResourceConfigOption>();
  namespaceConfigOption: Map<string, NamespaceConfigOption> = new Map<string, NamespaceConfigOption>();
  certificateConfigOption: Map<string, IngressCertificateConfigOption> = new Map<string, IngressCertificateConfigOption>();

  public error = "";
  public cluster: ClusterManager = new ClusterManager();


  constructor(public translate: TranslateService,
    private cluserService: ClusterManagerService,
    private domainService: DomainService,
    private datePipe: DatePipe,
    private router: Router,
    private authService: AuthService,

  ) {
    if (authService.getGlobalRole().includes('ROLE_SYSTEM_ADMIN')) {
      this.domainService.getAllBase().subscribe(result => {
        this.domains = result.filter(d => d.id !== this.domainService.getGlobalDomainId());
      });
    } else {
      this.domainService.getMyDomains().subscribe(result => {
        this.domains = result.filter(d => d.id !== this.domainService.getGlobalDomainId());
      });
    }



  }

  ngOnInit(): void {
    this.initializeMaps();
    this.translateUpdate = setInterval(() => {
      if (this.translate.instant('CLUSTERS.WIZARD.ADD') !== null) {
        this.steps = [
          { label: this.translate.instant('CLUSTERS.WIZARD.STEP_1') },
          { label: this.translate.instant('CLUSTERS.WIZARD.STEP_2') },
          { label: this.translate.instant('CLUSTERS.WIZARD.STEP_3') },
        ];
        this.stopTranslationUpdate();
      }
    }, 200);


  }


  public nextStep(): void {
    this.activeStepIndex += 1;
  }

  private stopTranslationUpdate() {
    clearInterval(this.translateUpdate);
    this.translateUpdate = null;
  }

  public uploadKubernetesFile(): void {
    this.cluserService.readClusterFile(new File([this.kubernetesFile], 'kubernetes.yaml'), this.cluster).subscribe(result => {
      console.log(result);
      this.cluster = result;
      this.nextStep();
    }, error => {
      console.error('Error reading Kubernetes file:', error);
    });


  }

  public onDomainSelection(event: any) {

    console.log(event);
    this.cluster.domainNames = [event]
  }

  public onDomainChange(event: any) {
    console.log(event);
    this.cluster.domainNames = [this.domains[0].name];
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


  public submit(): void {
    console.log(this.cluster);
    this.deteleDates();
    this.setInitialValues();
    this.cluserService.sendCluster(new File([this.kubernetesFile], 'kubernetes.yaml'), this.cluster).subscribe(result => {
      console.log(result);
      this.cluster = result;
      this.router.navigate(['/admin/manage/clusters']);
    });
  }

  private deteleDates() {
    this.cluster.creationDate = null;
    this.cluster.modificationDate = null;
    this.cluster.currentStateSince = null;
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
    return this.datePipe.transform(date, 'dd-MM-yyyy HH:mm');
  }

  public step2valid(): boolean {
    return this.cluster.domainNames.length > 0 && this.cluster.contactEmail !== '' && this.cluster.description !== ''
  }

  public setInitialValues() {
    this.cluster.ingress.controllerConfigOption = IngressControllerConfigOption.USE_EXISTING;
    this.cluster.ingress.controllerChartName = "";
    this.cluster.ingress.controllerChartArchive = "";
    this.cluster.ingress.resourceConfigOption = IngressResourceConfigOption.DEPLOY_FROM_CHART;

  }

}
