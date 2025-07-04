import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkViewComponent } from './bulk-view.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {RouterModule} from '@angular/router';
import { DatePipe } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('BulkViewComponent', () => {
  let component: BulkViewComponent;
  let fixture: ComponentFixture<BulkViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [BulkViewComponent],
    imports: [RouterModule.forRoot([])],
    providers: [
        DatePipe,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
