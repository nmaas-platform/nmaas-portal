import {inject, TestBed} from '@angular/core/testing';

import {ProfileService} from './profile.service';
import {Observable, of} from 'rxjs';
import {Configuration} from '../model/configuration';
import {AppConfigService} from './appconfig.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

class MockConfigurationService {
    protected uri: string;

    constructor() {
        this.uri = 'http://localhost/api';
    }

    public getApiUrl(): string {
        return 'http://localhost/api';
    }

    public getConfiguration(): Observable<Configuration> {
        return of<Configuration>();
    }

    public updateConfiguration(configuration: Configuration): Observable<any> {
        return of<Configuration>();
    }
}

describe('ProfileService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
    imports: [],
    providers: [
        ProfileService,
        { provide: AppConfigService, useClass: MockConfigurationService },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
});
    });

    it('should be created', inject([ProfileService], (service: ProfileService) => {
        expect(service).toBeTruthy();
    }));
});
