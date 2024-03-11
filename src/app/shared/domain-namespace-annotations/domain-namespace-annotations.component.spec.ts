import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainNamespaceAnnotationsComponent } from './domain-namespace-annotations.component';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DomainNamespaceAnnotationsComponent', () => {
  let component: DomainNamespaceAnnotationsComponent;
  let fixture: ComponentFixture<DomainNamespaceAnnotationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DomainNamespaceAnnotationsComponent ],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        })
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DomainNamespaceAnnotationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
