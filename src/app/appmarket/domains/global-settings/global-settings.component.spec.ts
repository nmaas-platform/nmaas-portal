import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalSettingsComponent } from './global-settings.component';
import {ResourcesLimitService} from '../../../service/resources-limit.service';
import {of} from 'rxjs';
import {FormsModule} from '@angular/forms';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {ToastContainerComponent} from '../../../shared/toast-container/toast-container.component';

class TranslateFakeLoader implements TranslateLoader {
  getTranslation(lang: string) {
    return of({});
  }
}

describe('GlobalSettingsComponent', () => {
  let component: GlobalSettingsComponent;
  let fixture: ComponentFixture<GlobalSettingsComponent>;
  let mockService: jasmine.SpyObj<ResourcesLimitService>;
  let mockToast: jasmine.SpyObj<ToastContainerComponent>;

  beforeEach(async () => {
    mockService = jasmine.createSpyObj('ResourcesLimitService', ['getGlobalLimit', 'setGlobalLimit']);
    mockService.getGlobalLimit.and.returnValue(of({ limitType: 'GLOBAL'}));
    mockService.setGlobalLimit.and.returnValue(of({limitType: 'GLOBAL'}));
    mockToast = jasmine.createSpyObj('ToastContainerComponent', ['show']);

    await TestBed.configureTestingModule({
      declarations: [GlobalSettingsComponent],
      imports: [FormsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        }),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {provide: ResourcesLimitService, useValue: mockService},
        { provide: ToastContainerComponent, useValue: mockToast }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobalSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
