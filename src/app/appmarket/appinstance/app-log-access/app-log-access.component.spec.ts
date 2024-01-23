import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AppLogAccessComponent} from './app-log-access.component';
import {AppLogsService} from '../../../service/app-logs.service';
import {HttpClient, HttpHandler} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {of} from 'rxjs';

describe('AppLogAccessComponent', () => {
    let component: AppLogAccessComponent;
    let fixture: ComponentFixture<AppLogAccessComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AppLogAccessComponent],
            providers: [AppLogsService, HttpClient, HttpHandler, {provide: ActivatedRoute, useValue: {params: of({id: 1})}}]
        })
            .compileComponents();

        fixture = TestBed.createComponent(AppLogAccessComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
