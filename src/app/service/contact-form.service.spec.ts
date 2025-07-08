import {TestBed} from '@angular/core/testing';

import {ContactFormService} from './contact-form.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {AccessModifier} from '../model/contact-form-type';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('ContactFormService', () => {
    let service: ContactFormService;

    beforeEach(() => {
        TestBed.configureTestingModule({
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
        service = TestBed.inject(ContactFormService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should retrieve default form from assets', () => {
        service.getForm('default').subscribe(
            data => expect(data).toBeTruthy()
        );
    });

    it('should load default when form is missing', () => {
        service.getForm('missing').subscribe(
            data => expect(data).toBeTruthy()
        );
    });

    it('should return predefined list of contact types as map', () => {
        service.getAllFormTypesAsMap().subscribe(
            data => {
                expect(data).toBeTruthy();
                expect(data.keys()).toBeDefined();
            }
        )
    });

    it('should return list of contact types with proper access types', () => {
        service.getAllFormTypes().subscribe(
            data => data.map(t => t.access).forEach(
                a => expect(
                    a === AccessModifier.ALL
                    || a === AccessModifier.ONLY_LOGGED_IN
                    || a === AccessModifier.ONLY_NOT_LOGGED_IN
                ).toBeTruthy())
        )
    })
});
