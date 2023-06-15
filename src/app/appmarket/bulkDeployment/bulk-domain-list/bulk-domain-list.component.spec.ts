import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkDomainListComponent } from './bulk-domain-list.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('BulkDomainListComponent', () => {
  let component: BulkDomainListComponent;
  let fixture: ComponentFixture<BulkDomainListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkDomainListComponent ],
      imports: [
          HttpClientTestingModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkDomainListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
