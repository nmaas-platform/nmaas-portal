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
        } )
    })
      }


       public submit(): void {
        console.log(this.webhook);
        this.service.update(this.webhook).subscribe(result => {
            console.log(result);
            this.webhook = result;
        });
    }
}
