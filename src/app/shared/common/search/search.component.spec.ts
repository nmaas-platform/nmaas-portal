import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SearchComponent } from './search.component';
import { TranslateLoader, TranslateModule} from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import {of} from 'rxjs';

class TranslateFakeLoader implements TranslateLoader {
  getTranslation(lang: string) {
    return of({});
  }
}

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchComponent ],
      imports : [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        }),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
   expect(component).toBeTruthy();
  });
});
