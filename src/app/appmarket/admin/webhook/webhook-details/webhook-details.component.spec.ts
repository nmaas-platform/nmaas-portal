import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebhookDetailsComponent } from './webhook-details.component';

describe('WebhookDetailsComponent', () => {
  let component: WebhookDetailsComponent;
  let fixture: ComponentFixture<WebhookDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WebhookDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WebhookDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
