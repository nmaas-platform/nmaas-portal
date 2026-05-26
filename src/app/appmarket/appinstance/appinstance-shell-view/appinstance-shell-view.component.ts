import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AppInstanceService} from '../../../service';
import {TranslateService} from '@ngx-translate/core';
import {interval, Subscription} from 'rxjs';
import {ShellClientService} from '../../../service/shell-client.service';
import {PodInfo} from '../../../model/podinfo';
import {SelectPodModalComponent} from '../modals/select-pod-modal/select-pod-modal.component';

@Component({
    selector: 'app-appinstance-shell-view',
    templateUrl: './appinstance-shell-view.component.html',
    styleUrls: [],
    standalone: false
})
export class AppInstanceShellViewComponent implements OnInit {

    @ViewChild(SelectPodModalComponent)
    public selectPodModal: SelectPodModalComponent;

    public appInstanceId: number = undefined;
    public podName: string = undefined;
    public appInstanceName: string = undefined;
    public ready = false;
    private podPolling?: Subscription;
    podNames: PodInfo[] = [];
    showSelectPodModal = false;

    constructor(private route: ActivatedRoute,
                public router: Router,
                private appInstanceService: AppInstanceService,
                private shellClientService: ShellClientService,
                private translateService: TranslateService) {
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.appInstanceId = +params['id'];
            this.podName = params['podname'];
            this.appInstanceService.getAppInstance(this.appInstanceId).subscribe({
                next: data => {
                    this.appInstanceName = data.name;
                    if (this.podName) {
                        this.ready = true;
                        return;
                    }
                    this.waitForPods();
                },
                error: error => {
                    console.error(error);
                }
            });
        });
    }

    private waitForPods(): void {
        this.podPolling = interval(2000).subscribe(() => {
            this.shellClientService.getPossiblePods(this.appInstanceId).subscribe({
                next: pods => {

                    if (!pods || pods.length === 0) {
                        return;
                    }
                    if (pods.length === 1) {
                        this.ready = false;
                        this.router.navigate([this.router.url + '/' + pods[0].name]);
                        this.stopPolling();
                        return;
                    }
                    if (pods.length > 1) {
                        this.podNames = pods;
                        this.showSelectPodModal = true;
                        return;
                    }
                    this.stopPolling();
                },
                error: err => {
                    console.error(err);
                }
            });
        });
    }

    private stopPolling(): void {
        if (this.podPolling) {
            this.podPolling.unsubscribe();
            this.podPolling = undefined;
        }
    }

    private notFound(): void {
        const promise = this.router.navigateByUrl('/notfound');
        promise.then(result => {
            if (result) {
                console.log('Redirected');
            } else {
                console.log('Failed');
            }
        })
    }
    ngOnDestroy(): void {
        this.stopPolling();
    }

}
