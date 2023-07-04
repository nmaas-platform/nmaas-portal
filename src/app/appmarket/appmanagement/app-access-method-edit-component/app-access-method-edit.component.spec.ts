import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {AppAccessMethodEditComponent} from './app-access-method-edit.component';
import {FormsModule} from '@angular/forms';
import {ServiceAccessMethodType} from '../../../model/service-access-method';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {ConditionType} from '../../../model/app-access-method';

describe('AppAccessMethodEditComponent', () => {
  let component: AppAccessMethodEditComponent;
  let fixture: ComponentFixture<AppAccessMethodEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AppAccessMethodEditComponent ],
      imports: [
          FormsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        })
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppAccessMethodEditComponent);
    component = fixture.componentInstance;
    component.id = 0;
    component.accessMethodTypes = ['INTERNAL', 'EXTERNAL'];
    component.accessMethod = {
      id: 2,
      type: ServiceAccessMethodType.INTERNAL,
      name: 'd',
      tag: 't',
      deployParameters: {},
      conditionType: ConditionType.NONE,
      condition: ''
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
