import {Component, OnInit} from '@angular/core';
import {BaseComponent} from '../../../../shared/common/basecomponent/base.component';
import {Router} from '@angular/router';
import {ConfigurationService, DomainService} from '../../../../service';
import {Configuration} from '../../../../model/configuration';
import {InternationalizationService} from '../../../../service/internationalization.service';
import {Language} from '../../../../model/language';
import {ToastContainerComponent, ToastMode} from '../../../../shared/toast-container/toast-container.component';
import {Domain} from '../../../../model/domain';



@Component({
    selector: 'app-configurationdetails',
    templateUrl: './configurationdetails.component.html',
    styleUrls: ['./configurationdetails.component.css'],
    standalone: false
})
export class ConfigurationDetailsComponent extends BaseComponent implements OnInit {

    public errorMsg: string;
    public configuration: Configuration;
    public languages: Language[];
    public domainForSsoUsers: Domain[];

    constructor(private router: Router,
                private configurationService: ConfigurationService,
                private languageService: InternationalizationService,
                private toast: ToastContainerComponent,
                private domainService: DomainService) {
        super();
    }

    ngOnInit() {
        this.update();
        this.languageService.getAllSupportedLanguages().subscribe(langs => this.languages = langs);
        this.domainService.getAll().subscribe(domains => {
            this.domainForSsoUsers = domains.filter(domain => domain.id !== 1);
        })
    }

    public update(): void {
        this.configurationService.getConfiguration().subscribe(value => this.configuration = value, err => this.errorMsg = err.message);
    }

    public save(): void {

        this.configurationService.updateConfiguration(this.configuration).subscribe(
            () => {
                this.update()
                this.toast.show('TOAST.SUCCESS.SETTINGS', ToastMode.SUCCESS, 'TOAST.SUCCESS_HEADER')
            },
            err => {
                this.errorMsg = err.message
                this.toast.show('TOAST.ERROR.SETTINGS', ToastMode.DANGER, 'TOAST.ERROR_HEADER')
            }
        );
    }

    public addEmailEntry(): void {
        const arrLength = this.configuration.appInstanceFailureEmailList.length;
        if (arrLength === 0 || this.configuration.appInstanceFailureEmailList[arrLength - 1] !== '') {
            const res = this.configuration.appInstanceFailureEmailList.push('');
            console.log(res);
        }
    }

    public removeEmailEntry(email: string): void {
        this.configuration.appInstanceFailureEmailList = this.configuration.appInstanceFailureEmailList.filter(e => e !== email)
    }

    trackByFn(index: any, item: any) {
        return index;
    }

}
