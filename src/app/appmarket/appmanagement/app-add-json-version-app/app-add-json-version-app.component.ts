import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {ModalComponent} from '../../../shared';
import {AppsService} from '../../../service';

@Component({
    selector: 'app-app-add-json-version-app',
    templateUrl: './app-add-json-version-app.component.html',
    styleUrls: []
})
export class AppAddJsonVersionAppComponent {

    @ViewChild(ModalComponent, {static: true})
    public readonly modal: ModalComponent;

    public jsonText = '';
    public error = '';

    public JsonError = false;

    @Output()
    public refresh: EventEmitter<boolean> = new EventEmitter<boolean>();


    constructor(private readonly appsService: AppsService) {
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
                try {
                    JSON.parse(fileReader.result);
                    this.appsService.createApplication(JSON.parse(fileReader.result)).subscribe(result => {
                           this.handleUpload(result)
                        },
                        error => {
                            this.handleError(error)
                        })
                } catch (e) {
                    console.warn('invalid json')
                    this.JsonError = true;
                }
            }
        }
        fileReader.onerror = (error) => {
            console.log(error);
        }
    }

    public sendJsonText() {
        if (this.jsonText.length > 0) {
            try {
                JSON.parse(this.jsonText);
                this.appsService.createApplication(JSON.parse(this.jsonText)).subscribe(result => {
                        this.handleUpload(result)
                    },
                    error => {
                        this.handleError(error)
                    })
            } catch (e) {
                console.warn('invalid json')
                this.JsonError = true;
            }
        }
    }

    public show() {
        this.modal.show();
    }

    private handleUpload(result: any) {
        console.log('uploaded', result);
        this.modal.hide();
        this.refresh.emit(true);
    }

    private handleError(error: any) {
        console.log(error)
        if (error.message === null) {
            this.JsonError = true;
        } else {
            this.error = error.message
        }
    }
}
