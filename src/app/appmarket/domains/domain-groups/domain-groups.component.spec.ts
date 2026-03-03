import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainGroupsComponent } from './domain-groups.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {SearchDomainGroupPipe} from '../domain-group-search.pipe';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {of} from 'rxjs';
class TranslateFakeLoader implements TranslateLoader {
    getTranslation(lang: string) {
        return of({});
    }
}

describe('DomainGroupsComponent', () => {
  let component: DomainGroupsComponent;
  let fixture: ComponentFixture<DomainGroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [DomainGroupsComponent, SearchDomainGroupPipe],
    schemas: [NO_ERRORS_SCHEMA],
    imports: [TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useClass: TranslateFakeLoader
            }
        })],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
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
