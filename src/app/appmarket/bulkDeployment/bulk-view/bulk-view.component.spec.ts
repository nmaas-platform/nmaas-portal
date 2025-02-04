import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkViewComponent } from './bulk-view.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterModule} from '@angular/router';
import { DatePipe } from '@angular/common';

describe('BulkViewComponent', () => {
  let component: BulkViewComponent;
  let fixture: ComponentFixture<BulkViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkViewComponent ],
      imports: [
          HttpClientTestingModule,
        RouterModule.forRoot([]),
      ],
      providers: [
        DatePipe
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
