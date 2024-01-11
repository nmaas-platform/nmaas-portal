import {Component, Input, OnInit} from '@angular/core';
import {PodLogs} from '../../../model/pod-logs';
import {AppLogsService} from '../../../service/app-logs.service';
import {PodInfo} from '../../../model/podinfo';

@Component({
    selector: 'app-log-access',
    templateUrl: './app-log-access.component.html',
    styleUrls: ['./app-log-access.component.css']
})
export class AppLogAccessComponent implements OnInit {
    @Input()
    public appInstanceId: number;
    public pods: Map<PodInfo, PodLogs>;
    public podInfos: PodInfo[];
    public selectedPodInfo: PodInfo = undefined;
    public selectedPodLogs: PodLogs = undefined;

    public blobUrl;

    constructor(private logService: AppLogsService) {
    }

    ngOnInit(): void {
        this.logService.getPodNames(this.appInstanceId).subscribe(
            podNames => {
                this.pods = new Map<PodInfo, PodLogs>();
                this.podInfos = podNames;
                podNames.forEach(pod => {
                    this.logService.getLogsFromPod(this.appInstanceId, pod.name).subscribe(
                        podLogs => {
                            this.pods.set(pod, podLogs);
                        }
                    )
                })
            }
        )
    }

    getLogs(podName: string, lines: string[]): void {
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

    hasMultiplePods(): boolean {
        return this.pods.size > 1;
    }

    selectPod(event: any): void {
        this.selectedPodLogs = this.pods.get(event.value);
    }
}
