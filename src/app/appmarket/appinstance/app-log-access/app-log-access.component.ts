import {Component, OnInit} from '@angular/core';
import {PodLogs} from '../../../model/pod-logs';
import {AppLogsService} from '../../../service/app-logs.service';
import {PodInfo} from '../../../model/podinfo';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-log-access',
    templateUrl: './app-log-access.component.html',
    styleUrls: ['./app-log-access.component.css']
})
export class AppLogAccessComponent implements OnInit {
    public appInstanceId: number;
    public podInfos: PodInfo[];
    public selectedPodInfo: PodInfo = undefined;
    public selectedPodLogs: PodLogs = undefined;
    public containers: string[];
    public selectedContainer: string = undefined;

    public blobUrl;

    constructor(private logService: AppLogsService,
                private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.appInstanceId = params['id'];
            this.logService.getPodNames(this.appInstanceId).subscribe(
                podInfos => {
                    this.podInfos = podInfos;
                    this.selectedPodInfo = podInfos[0]
                    this.containers = this.selectedPodInfo.containers
                    this.selectedContainer = this.containers[0]
                    this.logService.getLogsFromPod(this.appInstanceId, this.selectedPodInfo.name, this.selectedPodInfo.containers[0])
                        .subscribe(podLogs => this.selectedPodLogs = podLogs)
                }
            )
        })
    }

    refreshLogs(): void {
        this.logService.getLogsFromPod(this.appInstanceId, this.selectedPodInfo.name, this.selectedContainer).subscribe(
            podLogs => this.selectedPodLogs = podLogs
        )
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
        this.selectedPodInfo = event.value
        this.selectedContainer = this.selectedPodInfo.containers[0]
        this.containers = this.selectedPodInfo.containers
        this.logService.getLogsFromPod(this.appInstanceId, this.selectedPodInfo.name, this.selectedContainer).subscribe(
            podLogs => this.selectedPodLogs = podLogs
        )
    }

    selectContainer(event: any): void {
        this.selectedContainer = event.value;
        this.logService.getLogsFromPod(this.appInstanceId, this.selectedPodInfo.name, this.selectedContainer).subscribe(
            podLogs => {
                this.selectedPodLogs = podLogs
            }
        )
    }
}
