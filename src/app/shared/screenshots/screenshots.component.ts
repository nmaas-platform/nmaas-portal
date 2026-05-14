import {Component, OnInit, Input, ViewEncapsulation, Output, EventEmitter} from '@angular/core';


import { AppsService } from '../../service';
import { FileInfo } from '../../model';


@Component({
    selector: 'screenshots',
    templateUrl: './screenshots.component.html',
    styleUrls: ['./screenshots.component.css'],
    encapsulation: ViewEncapsulation.None,
    standalone: false
})
export class ScreenshotsComponent implements OnInit {

    @Input()
    public pathUrl: string;

    public imagesFileInfo: FileInfo[];

    public selectedImg: string;
    selectedImage: any = null;

    @Output()
    numberOfScreenshots: EventEmitter<any> = new EventEmitter<any>();

    constructor(public appsService: AppsService) {
    }

    ngOnInit() {
        this.appsService.getAppScreenshotsByUrl(this.pathUrl).subscribe(fileInfos =>  {
            this.imagesFileInfo = fileInfos
            this.numberOfScreenshots.emit(this.imagesFileInfo.length);
        }
        );
      
    }

    public showImage(url: string): void {
        this.selectedImg = url;
    }
}
