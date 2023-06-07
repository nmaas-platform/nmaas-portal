import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ModalComponent} from '../../../shared';
import {AppsService} from '../../../service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-app-add-json-version-app',
  templateUrl: './app-add-json-version-app.component.html',
  styleUrls: ['./app-add-json-version-app.component.css']
})
export class AppAddJsonVersionAppComponent implements OnInit {

  @ViewChild(ModalComponent, { static: true })
  public readonly modal: ModalComponent;

  public jsonText = '';
  public error = '';

  @Output()
  public refresh: EventEmitter<boolean> = new EventEmitter<boolean>();


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
        this.appsService.createApplication(JSON.parse(fileReader.result)).subscribe(result => {
              console.log('uploaded', result);
              this.modal.hide();
                this.refresh.emit(true);
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
      this.appsService.createApplication(JSON.parse(this.jsonText)).subscribe(result => {
            console.log('uploaded', result);
            this.modal.hide();
            this.refresh.emit(true);
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
