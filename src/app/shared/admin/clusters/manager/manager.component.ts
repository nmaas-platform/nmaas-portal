import { Component, ViewChild } from '@angular/core';
import { ClusterManagerService } from '../../../../service/cluster-manager.service';
import { ClusterManager } from '../../../../model/cluster-manager';
import { ModalComponent } from '../../../modal';
import { DomainService } from '../../../../service';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrl: './manager.component.css'
})
export class ClusterManagerComponent {

  public clusters: ClusterManager[] = [];

  public updatedFile: File = null;
  public maxItemsOnPage = 15;
  public assignedDomain: boolean = false;
  public searchValue = '';
  filteredClusters: ClusterManager[] = [];


    @ViewChild(ModalComponent, { static: true })
    public modal: ModalComponent;

  constructor(private clusterService: ClusterManagerService,
              ) {
    this.getAllClusters();
   
  }

  public saveFile(event: any) {
        console.log(event);
        this.updatedFile = event.files[0];
  }

  public getAllClusters() {
       this.clusterService.getAllClusters().subscribe(result => {
           console.log(result);
           this.clusters = result;
           this.filterClusters();
         })
  }


public deleteCluster(cluster: ClusterManager) {
  this.clusterService.deleteCluster(cluster.id).subscribe(() => { 
    console.log('Cluster deleted successfully');
    this.getAllClusters();
  }, error => {
    console.error('Error deleting cluster:', error);   
  }
  );
}


    filterClusters() {
        const value = this.searchValue?.toLowerCase() || '';
        this.filteredClusters = this.clusters.filter(cluster =>
            cluster.name?.toLowerCase().includes(value) ||
            cluster.codename?.toLowerCase().includes(value) ||
            cluster.id?.toString().includes(value)
        );
    }
}
