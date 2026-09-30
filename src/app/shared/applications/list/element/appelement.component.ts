import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild, ViewEncapsulation} from '@angular/core';
import {AppConfigService, AppImagesService} from '../../../../service';
import {RateComponent} from '../../../rate';
import {DefaultLogo} from '../../../../directive/defaultlogo.directive';

import {SecurePipe} from '../../../../pipe';
import {Router} from '@angular/router';
import {AppInstallModalComponent} from '../../../modal/appinstall';
import {AuthService} from '../../../../auth/auth.service';
import {TranslateService} from '@ngx-translate/core';
import {AppDescription} from '../../../../model/app-description';
import {Domain} from '../../../../model/domain';
import {ApplicationBase} from '../../../../model/application-base';
import {BundleService} from '../../../../service/bundle.service';
import {ModalComponent} from '../../../modal';
import {Bundle} from '../../../../model/bundle';
import {BundleDescription} from "../../../../model/bundle-description";

@Component({
    selector: 'nmaas-applist-element',
    providers: [DefaultLogo, RateComponent, AppImagesService, SecurePipe, AppInstallModalComponent],
    templateUrl: './appelement.component.html',
    styleUrls: ['./appelement.component.css'],
    encapsulation: ViewEncapsulation.None,
    standalone: false
})
export class AppElementComponent implements OnInit, OnChanges {

    public defaultTooltipOptions = {
        'display': true,
        'placement': 'bottom',
        'show-delay': '50',
        'theme': 'dark'
    };

    @Input()
    public app: ApplicationBase;

    @Input()
    public selected: boolean;

    @Input()
    public domainId: number;

    @Input()
    public domain: Domain;

    @Input()
    public showSubscribed: boolean;

    public isInBundle:boolean

    protected bundles: Bundle[] = []

    protected selectedBundle: Bundle;

    @ViewChild(AppInstallModalComponent)
    public readonly modal: AppInstallModalComponent;

    @ViewChild('bundleModal')
    protected readonly bundlesModal: ModalComponent;

    public showAppInList = true;

    constructor(public appImagesService: AppImagesService,
                public appConfigService: AppConfigService,
                public router: Router,
                public authService: AuthService,
                public translate: TranslateService,
                private readonly bundleService: BundleService) {
    }

    ngOnInit() {
        this.selected ??= false;
        if (this.domain) {
            this.showAppInList = this.isApplicationEnabledInDomain();
        }
        this.bundleService.isAppInBundle(this.app.id).subscribe((exists:boolean)=>{
            this.isInBundle = exists;
            console.log("Is in bundle",this.isInBundle);
            if(exists) this.loadBundles();
        })
    }

    private loadBundles(){
        this.bundleService.getAllByApplicationRaw(this.app.id).subscribe((bundles:Bundle[])=>{
            this.bundles = bundles;
            this.selectedBundle = this.bundles[0];
            console.log("Bundles",this.bundles);
        })
    }

    protected selectBundle(bundle:Bundle){
        this.selectedBundle = bundle;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.domain) {
            this.defaultTooltipOptions.display = !this.isApplicationEnabledInDomain();
            this.showAppInList = this.isApplicationEnabledInDomain();
        }
    }

    public showDeployButton(): boolean {
        return this.domainId !== this.appConfigService.getNmaasGlobalDomainId() &&
            !this.authService.hasDomainRole(this.domainId, 'ROLE_GUEST') &&
            !this.authService.hasDomainRole(this.domainId, 'ROLE_USER');
    }

    public getDescription(): AppDescription {
        return this.app.descriptions.find(val => val.language === this.translate.currentLang);
    }

    public isApplicationEnabledInDomain(): boolean {
        return this.domain.applicationStatePerDomain.find(value => value.applicationBaseId === this.app.id).enabled || false
    }
    protected showBundlesModal():void{
        this.bundlesModal.show();
        // alert('show bundles modal');
    }

    private getAvailableDescLanguages(){
        return this.selectedBundle.descriptions.map(d => d.language);
    }

    getBundleDescription(): BundleDescription {
        // console.log(this.translate.currentLang, this.selectedBundle.descriptions?.find(d => d.language === this.translate.currentLang), "WWWWWWWWWWWWWWWWWWWWWWWWWWW");
        if(this.selectedBundle !== undefined){
            if(this.getAvailableDescLanguages().includes(this.translate.currentLang)){
                return this.selectedBundle.descriptions.find(d => d.language === this.translate.currentLang);
            }else{
                return this.selectedBundle.descriptions.find(d => d.language === 'en');
            }
        }
        return null;
    }
}
