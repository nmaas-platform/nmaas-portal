import {TestBed} from '@angular/core/testing';

import {ThemeModeService} from './theme-mode.service';
import {AuthService} from '../auth/auth.service';

describe('ThemeModeService', () => {
    let service: ThemeModeService;
    const authUserSpy = jasmine.createSpyObj('AuthService', ['getSelectedThemeMode']);

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ {provide: AuthService, useValue: authUserSpy}]
        });
        service = TestBed.inject(ThemeModeService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
