import {Component, OnInit, Pipe, PipeTransform, ViewChild} from '@angular/core';
import {Bundle} from '../../../model/bundle';
import {BundleService} from '../../../service/bundle.service';
import {ActivatedRoute, Router} from '@angular/router';
import {BundleDescription} from '../../../model/bundle-description';
import {BaseComponent} from '../../../shared/common/basecomponent/base.component';
import {BundleBasic} from '../../../model/bundle-basic';
import {ComponentMode, ModalComponent} from '../../../shared';
import {AppsService} from '../../../service';
import {ApplicationBase} from '../../../model/application-base';

@Component({
    selector: 'app-bundle-details',
    templateUrl: './bundle-details.component.html',
    styleUrl: './bundle-details.component.css',
    standalone: false
})
export class BundleDetailsComponent extends BaseComponent implements OnInit {

    @ViewChild(ModalComponent, {static: true})
    public readonly modal: ModalComponent;

    private bundleId: number;
    readonly languages = ['en', 'pl', 'de', 'fr'];
    protected bundle: Bundle;
    protected apps: ApplicationBase[];
    protected availableApps: ApplicationBase[];


    constructor(private readonly bundleService: BundleService,
                private readonly router: Router,
                private readonly route: ActivatedRoute,
                private readonly appService: AppsService
    ) {
        super()
    }

    ngOnInit(): void {
        this.mode = this.getMode(this.route);

        switch (this.mode) {
            case ComponentMode.EDIT:
                this.getBundle();
                this.getAppBase();
                break;
            case ComponentMode.CREATE:
                this.getAppBase();
                this.bundle = new Bundle();
                break;
            case ComponentMode.VIEW:
                this.getBundle();
                break
            default:
        }


    }

    private getAppBase() {
        this.appService.getAllApplicationBase().subscribe({
                next: (data) => this.apps = data,
                error: (err) => console.error(err),
            }
        );
    }

    private getBundle() {
        this.route.params.subscribe(params => {
            if (params['id'] !== undefined) {
                this.bundleId = +params['id']
                this.bundleService.getById(this.bundleId).subscribe(bundle => this.bundle = bundle);
            }
        })
    }


    protected submit(): void {


        switch (this.mode) {
            case ComponentMode.EDIT:
                if (this.bundleId != undefined) {
                    this.updateBundle();
                }
                break;
            case ComponentMode.CREATE:
                this.createBundle()
                break;
            default:
        }


    }

    private updateBundle() {
        this.bundleService.update(this.toBundleBasic(this.bundle), this.bundleId).subscribe();
    }

    private createBundle() {
        this.bundleService.create(this.toBundleBasic(this.bundle)).subscribe({
            next: (data) => {
                this.bundleId = data.id;
                this.router.navigate(['../view/', this.bundleId], {relativeTo: this.route});

            }
        });
    }

    private toBundleBasic(bundle: Bundle): BundleBasic {
        return {
            name: bundle.name,
            codeName: bundle.codeName,
            descriptions: bundle.descriptions,
            apps: bundle.apps.map(app => app.id)
        };
    }

    getDescription(lang: string): BundleDescription | undefined {
        return this.bundle.descriptions?.find(d => d.language === lang);
    }

    addDescription(lang: string): void {
        this.bundle.descriptions ??= [];
        this.bundle.descriptions.push({id: null, language: lang, briefDescription: '', fullDescription: ''});
    }

    removeDescription(lang: string): void {
        this.bundle.descriptions = this.bundle.descriptions.filter(d => d.language !== lang);
    }

    protected showModal() {
        this.modal.show();
    }

    protected closeModal() {
        // this.bundle.apps = this.apps;
        this.modal.hide();
    }


}

@Pipe({name: 'description'})
export class DescriptionPipe implements PipeTransform {
    transform(
        descriptions: BundleDescription[] | undefined,
        lang: string,
        fallback = true
    ): BundleDescription | undefined {
        const exact = descriptions?.find(d => d.language === lang);
        return exact ?? (fallback ? descriptions?.[0] : undefined);
    }
}
