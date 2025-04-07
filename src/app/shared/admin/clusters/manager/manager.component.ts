import { Component } from '@angular/core';
import { ClusterManagerService } from '../../../../service/cluster-manager.service';
import { ClusterManager } from '../../../../model/cluster-manager';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrl: './manager.component.css'
})
export class ClusterManagerComponent {

  public clusters: ClusterManager[] = [];

  constructor(private clusterService: ClusterManagerService) {
    this.getAllClusters();
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

    public getAllClusters() {
        this.clusterService.getAllClusters().subscribe(result => { 
          console.log(result);
            this.clusters = result;
        })
      }

}
