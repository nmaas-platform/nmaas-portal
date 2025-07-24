import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {SSHKeyService} from '../../../service/sshkey.service';
import {Observable} from 'rxjs';
import {SSHKeyView} from '../../../model/sshkey-view';

@Component({
    selector: 'nmaas-ssh-keys',
    templateUrl: './ssh-keys.component.html',
    styleUrls: ['./ssh-keys.component.css'],
    standalone: false
})
export class SshKeysComponent implements OnInit, OnChanges {

  public keys: Observable<SSHKeyView[]> = undefined;
  public keysList: SSHKeyView[] = [];

  @Input()
  public userMode = false;

  @Input()
  public userId : number;

  constructor(private keyService: SSHKeyService) { }

  ngOnInit() {
    if(this.userMode) {
        if(this.userId !== null) {
            this.keys = this.keyService.getAllByUserId(this.userId);
            this.getData();
        }
    } else { // profile view
        this.keys = this.keyService.getAll();
        this.getData();
    }
   
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['userId']) {
        this.ngOnInit();
      console.log('Nowa wartość userId:', this.userId);
    }
  }

  getData() {
      this.keysList = [];
      this.keys.subscribe(
          data => {
              this.keysList.push(...data);
          },
          error => {
              console.error(error);
          }
      )
  }

  invalidate(id: number) {
    if(this.userMode) {
        this.keyService.invalidateUserKey(id, this.userId).subscribe(
            data => {
                console.log('invalidating ssh key id: ' + id + ' success');
                this.getData();
            },
            error => {
                console.error(error);
            }
        );
    } else {
        this.keyService.invalidate(id).subscribe(
            data => {
                console.log('invalidating ssh key id: ' + id + ' success');
                this.getData();
            },
            error => {
                console.error(error);
            }
        );
    }
      
  }

}
