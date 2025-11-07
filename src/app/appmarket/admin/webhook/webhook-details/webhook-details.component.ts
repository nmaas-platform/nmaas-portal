import { Component, OnInit } from '@angular/core';
import { WebhookService } from '../../../../service/webhook.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Webhook } from '../../../../model/webhook';
import { BaseComponent } from '../../../../shared/common/basecomponent/base.component';
import {ToastContainerComponent, ToastMode} from '../../../../shared/toast-container/toast-container.component';
import {UserDataService} from '../../../../service/userdata.service';
import {DomainService} from '../../../../service';

@Component({
    selector: 'app-webhook-details',
    templateUrl: './webhook-details.component.html',
    styleUrl: './webhook-details.component.css',
    standalone: false
})
export class WebhookDetailsComponent extends BaseComponent implements OnInit {

  public webhooksId: number;
  public webhook: Webhook;
  public authRequired: boolean = false;

  public token: string = '';
  public authorizationHeader: string = '';

  public errorMessage: string = '';
  public domainGlobalId;
  public selectedDominId

  constructor(private service: WebhookService,
              public router: Router,
              private route: ActivatedRoute,
              private toast: ToastContainerComponent,
              public userDataService: UserDataService,
              public domainService: DomainService) {
                      super();
      }

      ngOnInit(): void {
        this.domainGlobalId = this.domainService.getGlobalDomainId();
          this.userDataService.selectedDomainId.subscribe(domainId => {
              this.selectedDominId = domainId;
              this.route.params.subscribe(params => {
                  this.webhooksId = +params['id'];
                  if (this.selectedDominId !== this.domainGlobalId) {
                      this.service.getOneByDomain(this.selectedDominId, this.webhooksId).subscribe(result => {
                          console.log(result);
                          this.webhook = result;
                          this.token = this.webhook.tokenValue;
                          this.authorizationHeader = this.webhook.authorizationHeader;
                          console.log('Doing copy', this.token, this.authorizationHeader)

                          if (this.webhook.tokenValue !== null ) {
                              this.authRequired = true;
                          }
                      })
                  } else {
                      this.service.getOne(this.webhooksId).subscribe(result => {
                          console.log(result);
                          this.webhook = result;
                          this.token = this.webhook.tokenValue;
                          this.authorizationHeader = this.webhook.authorizationHeader;
                          console.log('Doing copy', this.token, this.authorizationHeader)

                          if (this.webhook.tokenValue !== null ) {
                              this.authRequired = true;
                          }
                      })
                  }
              })
          })

      }


       public submit(): void {
        console.log(this.webhook);
        if (this.selectedDominId !== this.domainGlobalId) {
            this.service.updateByDomain(this.selectedDominId, this.webhook).subscribe(result => {
                console.log(result);
                this.webhook = result;
                this.token = result.tokenValue;
                this.authorizationHeader = result.authorizationHeader;
                this.toast.show('TOAST.SUCCESS.WEBHOOK', ToastMode.SUCCESS, 'TOAST.SUCCESS_HEADER')
                this.router.navigate(['admin/webhooks/']);
            }, error => {
                console.error(error);
                this.toast.show('TOAST.ERROR.WEBHOOK', ToastMode.DANGER, 'TOAST.ERROR_HEADER')
                this.errorMessage = 'Error updating webhook: ' + error.message;
            });
        } else {
            this.service.update(this.webhook).subscribe(result => {
                console.log(result);
                this.webhook = result;
                this.token = result.tokenValue;
                this.authorizationHeader = result.authorizationHeader;
                this.toast.show('TOAST.SUCCESS.WEBHOOK', ToastMode.SUCCESS, 'TOAST.SUCCESS_HEADER')
                this.router.navigate(['admin/webhooks/'])
            }, error => {
                console.error(error);
                this.toast.show('TOAST.ERROR.WEBHOOK', ToastMode.DANGER, 'TOAST.ERROR_HEADER')
                this.errorMessage = 'Error updating webhook: ' + error.message;
            });
        }

    }

    public onCheckboxChange() {
      console.log('Auth', this.authRequired, this.webhook, this.token, this.authorizationHeader)
      if (!this.authRequired) {
        this.webhook.tokenValue = null;
        this.webhook.authorizationHeader = null;
      } else {
        this.webhook.tokenValue = this.token;
        this.webhook.authorizationHeader = this.authorizationHeader;
      }
    }

    public isFormValid(): boolean {
      if (this.authRequired) {
        return this.webhook.tokenValue !== null && this.webhook.tokenValue !== '' &&
               this.webhook.authorizationHeader !== null && this.webhook.authorizationHeader !== '';
      } else {
        return true;
      }
    }
}
