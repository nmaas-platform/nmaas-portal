import {AfterViewChecked, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {PodLogs} from '../../../model/pod-logs';
import {AppLogsService} from '../../../service/app-logs.service';
import {PodInfo} from '../../../model/podinfo';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-log-access',
    templateUrl: './app-log-access.component.html',
    styleUrls: ['./app-log-access.component.css']
})
export class AppLogAccessComponent implements OnInit, AfterViewChecked {
    public appInstanceId: number;
    public podInfos: PodInfo[] = [];
    public containers: string[] = [];
    public selectedPodInfo: PodInfo = undefined;
    public selectedPodLogs: PodLogs = undefined;
    public selectedContainer: string = undefined;
    public isLoading = true;

    public blobUrl;

    @ViewChild('terminal', {static: false}) private terminalElement: ElementRef;

    @ViewChild('dropdown', {static: false}) private containerDropdown: ElementRef;

    constructor(private logService: AppLogsService,
                private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.appInstanceId = params['id'];
            this.logService.getPodNames(this.appInstanceId).subscribe(
                podInfos => {
                    this.podInfos = podInfos;
                    if (podInfos.length === 0) {
                        this.isLoading = false;
                        return
                    }
                    this.selectedPodInfo = podInfos[0];
                    if (this.selectedPodInfo.containers.length > 0) {
                        this.containers = this.selectedPodInfo.containers
                        this.selectedContainer = this.containers[0]
                        this.retrieveLogs()
                    }
                }
            )
        })
    }

    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    downloadLogs(podName: string, lines: string[]): void {
        const content = lines.join('\n');
        const blob = new Blob([content], {type: 'text/plain'})
        this.blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = this.blobUrl;
        a.download = `${podName}.txt`
        a.click();
        window.URL.revokeObjectURL(this.blobUrl);
        a.remove();
    }

    selectPod(event: any): void {
        if (event.value.containers.length > 0) {
            this.containers = event.value.containers
            this.selectedContainer = this.containers[0];
            this.retrieveLogs()
        } else {
            this.selectedContainer = null;
        }
    }

    selectContainer(): void {
        this.retrieveLogs()
    }

    retrieveLogs() {
        this.isLoading = true
        this.logService.getLogsFromPod(this.appInstanceId, this.selectedPodInfo.name, this.selectedContainer).subscribe(
            podLogs => {
                this.selectedPodLogs = podLogs
                this.isLoading = false
            }
        )
    }

    scrollToBottom(): void {
        try {
            this.terminalElement.nativeElement.scrollTop = this.terminalElement.nativeElement.scrollHeight;
        } catch (_) {}
    }
}
