import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalComponent} from '../../../shared';
import {AppsService} from '../../../service';
import {HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app-app-add-json-app',
  templateUrl: './app-add-json-app.component.html',
  styleUrls: ['./app-add-json-app.component.css']
})
export class AppAddJsonAppComponent implements OnInit {

  @ViewChild(ModalComponent, { static: true })
  public readonly modal: ModalComponent;

  public jsonText = '';
  public error = '';



  constructor(private readonly appsService: AppsService,
              private readonly router: Router) { }



  ngOnInit(): void {
  }

  onUpload(event: any) {
    console.log(event);
    const file = event.files[0];
    console.log(file);
    const fileReader = new FileReader();
    fileReader.readAsText(file);
    fileReader.onload = () => {
      if (typeof fileReader.result === 'string') {
        console.log(JSON.parse(fileReader.result));
        this.appsService.createApplicationDTO(JSON.parse(fileReader.result)).subscribe(result => {
          console.log('uploaded', result);
          this.modal.hide();
          this.router.navigate(['admin/apps/view/', result.id])
        },
            error => {
              console.log(error)
              this.error = error.message
            })
      }
    }
    fileReader.onerror = (error) => {
      console.log(error);
    }
  }

  public sendJsonText() {
    if (this.jsonText.length > 0) {
      this.appsService.createApplicationDTO(JSON.parse(this.jsonText)).subscribe(result => {
        console.log('uploaded', result);
        this.modal.hide();
        this.router.navigate(['admin/apps/view/', result.id])
      },
          error => {
        console.log(error)
          this.error = error.message
          })

    }
  }

  public show() {
    this.modal.show();
  }


}
