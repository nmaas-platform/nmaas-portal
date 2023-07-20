import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainGroupsComponent } from './domain-groups.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {SearchDomainGroupPipe} from '../domain-group-search.pipe';

describe('DomainGroupsComponent', () => {
  let component: DomainGroupsComponent;
  let fixture: ComponentFixture<DomainGroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DomainGroupsComponent, SearchDomainGroupPipe],
      imports: [
          HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        }),
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DomainGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
