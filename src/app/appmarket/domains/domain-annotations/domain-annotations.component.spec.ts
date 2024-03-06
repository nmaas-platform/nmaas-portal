import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainAnnotationsComponent } from './domain-annotations.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';

describe('DomainAnnotationsComponent', () => {
  let component: DomainAnnotationsComponent;
  let fixture: ComponentFixture<DomainAnnotationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DomainAnnotationsComponent ],
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

    fixture = TestBed.createComponent(DomainAnnotationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
