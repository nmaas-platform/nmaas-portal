import { Component, OnInit } from '@angular/core';
import { WebhookService } from '../../../../service/webhook.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Webhook } from '../../../../model/webhook';
import { BaseComponent } from '../../../../shared/common/basecomponent/base.component';

@Component({
  selector: 'app-webhook-details',
  templateUrl: './webhook-details.component.html',
  styleUrl: './webhook-details.component.css'
})
export class WebhookDetailsComponent extends BaseComponent implements OnInit {

  public webhooksId: number;
  public webhook: Webhook;
  public authRequired: boolean = false;

  public token : string = "";
  public authorizationHeader: string = "";

  public errorMessage: string = "";

  constructor(private service: WebhookService,
      public router: Router,
      private route: ActivatedRoute) {
                      super();
      }  
  

      ngOnInit(): void {
              this.route.params.subscribe(params => {
        this.webhooksId = +params['id'];

        this.service.getOne(this.webhooksId).subscribe(result => {
          console.log(result);
          this.webhook = result;
          this.token = this.webhook.tokenValue;
          this.authorizationHeader = this.webhook.authorizationHeader;
                    console.log("Doing copy", this.token, this.authorizationHeader)

          if(this.webhook.tokenValue !== null ) {
            this.authRequired = true;
          }
        } )
    })
      }


       public submit(): void {
        console.log(this.webhook);
        this.service.update(this.webhook).subscribe(result => {
            console.log(result);
            this.webhook = result;
            this.token =result.tokenValue;
            this.authorizationHeader = result.authorizationHeader;
        }, error => {
            console.error(error);
            this.errorMessage = "Error updating webhook: " + error.message;
        });
    }

    public onCheckboxChange() {
      console.log("Auth", this.authRequired, this.webhook, this.token, this.authorizationHeader)
      if(!this.authRequired) {
        this.webhook.tokenValue = null;
        this.webhook.authorizationHeader = null;
      } else {
        this.webhook.tokenValue = this.token;
        this.webhook.authorizationHeader = this.authorizationHeader; 
      }
    }
}
