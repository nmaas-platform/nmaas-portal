import { Component, OnDestroy, ViewChild } from '@angular/core';
import { ClusterManagerService } from '../../../../service/cluster-manager.service';
import { ClusterManager } from '../../../../model/cluster-manager';
import { ModalComponent } from '../../../modal';
import { DomainService } from '../../../../service';
import { UserDataService } from '../../../../service/userdata.service';
import { debounceTime } from 'rxjs';

@Component({
    selector: 'app-manager',
    templateUrl: './manager.component.html',
    styleUrl: './manager.component.css',
    standalone: false
})
export class ClusterManagerComponent implements OnDestroy {

  public clusters: ClusterManager[] = [];

  public updatedFile: File = null;
  public maxItemsOnPage = 15;
  public assignedDomain: boolean = false;
  public searchValue = '';
  filteredClusters: ClusterManager[] = [];

  private pipeRefresh: any;


  @ViewChild(ModalComponent, { static: true })
  public modal: ModalComponent;

  constructor(private clusterService: ClusterManagerService,
    protected userDataService: UserDataService
  ) {
    this.getAllClusters();

  }

  ngOnDestroy(): void {
      this.pipeRefresh.unsubscribe();
      this.pipeRefresh = null;
  }

  public saveFile(event: any) {
    console.log(event);
    this.updatedFile = event.files[0];
  }

  public getAllClusters() {
   this.pipeRefresh = this.userDataService.selectedDomainId.pipe(debounceTime(300)).subscribe((domainId) => {
      if (domainId != null) {
        this.clusterService.getClustersInDomain(domainId).subscribe(result => {
          console.log(result);
          this.clusters = result;
          this.filterClusters();
        });
      } else {
        this.clusterService.getAllClusters().subscribe(result => {
          console.log(result);
          this.clusters = result;
          this.filterClusters();
        })
      }
    });


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
