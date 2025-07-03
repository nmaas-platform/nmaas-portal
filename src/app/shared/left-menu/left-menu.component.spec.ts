import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LeftMenuComponent } from './left-menu.component';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { ToastContainerComponent } from '../toast-container/toast-container.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { of, Subject } from 'rxjs';
import {ProfileService} from '../../service/profile.service';
import {AuthService} from '../../auth/auth.service';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';

describe('LeftMenuComponent', () => {
  let component: LeftMenuComponent;
  let fixture: ComponentFixture<LeftMenuComponent>;
  let mockRouter: any;
  let mockToast: jasmine.SpyObj<ToastContainerComponent>;
  let routerEventsSubject: Subject<any>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    routerEventsSubject = new Subject();
    mockRouter = {
      events: routerEventsSubject.asObservable(),
      navigate: jasmine.createSpy('navigate')
    };
    mockToast = jasmine.createSpyObj('ToastContainerComponent', ['show']);
    mockActivatedRoute = {
      snapshot: { params: {}, queryParams: {} }
    };
    const profileServiceSpy = jasmine.createSpyObj('ProfileService', ['getOne'])
    profileServiceSpy.getOne.and.returnValue(of())

    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getPreferredUsername']);
    authServiceSpy.getPreferredUsername.and.returnValue(true)

    await TestBed.configureTestingModule({
      declarations: [LeftMenuComponent],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        }),
      ],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ToastContainerComponent, useValue: mockToast },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: ProfileService, useValue: profileServiceSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(LeftMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize menu items and collapsed state', () => {
    expect(component.items.length).toBeGreaterThan(0);
    expect(component.isCollapsed).toBeFalse();
  });

  it('should update currentUrl and toggleAdmin on NavigationEnd event', () => {
    const testUrl = '/admin/dashboard';
    routerEventsSubject.next(new NavigationEnd(1, testUrl, testUrl));
    expect(component.currentUrl).toBe(testUrl);
    expect(component.toggleAdmin).toBeTrue();
  });

  it('should toggle menu collapsed state and update CSS variable', () => {
    component.toggleMenu();
    expect(component.isCollapsed).toBeTrue();
    expect(sessionStorage.getItem('menuCollapsed')).toBe('true');

    component.toggleMenu();
    expect(component.isCollapsed).toBeFalse();
    expect(sessionStorage.getItem('menuCollapsed')).toBe('false');
  });

  it('should show toast message', () => {
    component.showToastTest();
    expect(mockToast.show).toHaveBeenCalledWith('Test test', jasmine.anything(), 'HEADER');
  });

  it('should toggle admin panel visibility', () => {
    component.toggleAdmin = false;
    component.adminPanel();
    expect(component.toggleAdmin).toBeTrue();

    component.adminPanel();
    expect(component.toggleAdmin).toBeFalse();
  });
});
