import { Component, ViewChild } from '@angular/core';
import { ClusterManagerService } from '../../../../service/cluster-manager.service';
import { ClusterManager } from '../../../../model/cluster-manager';
import { ModalComponent } from '../../../modal';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrl: './manager.component.css'
})
export class ClusterManagerComponent {

  public clusters: ClusterManager[] = [];

  public addedCluster: ClusterManager = new ClusterManager();
  public updatedFile : File = null;

    @ViewChild(ModalComponent, { static: true })
    public modal: ModalComponent;

  constructor(private clusterService: ClusterManagerService) {
    this.getAllClusters();
  }

 public saveFile(event: any) {
    console.log(event);
    this.updatedFile =event.files[0];     
    }

public getAllClusters() {
    this.clusterService.getAllClusters().subscribe(result => { 
          console.log(result);
            this.clusters = result;
        })
      }

public closeModalAndSaveCluster() {
  this.clusterService.sendCluster(this.updatedFile, this.addedCluster).subscribe(result => { 
    console.log(result);
    this.getAllClusters();
    this.modal.hide();
    this.updatedFile = null;
    this.addedCluster = new ClusterManager();
  }, error => {
    console.error(error);
    
  }
)
}



}
