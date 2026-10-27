import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Menu} from 'primeng/menu';
import {MenuItem} from 'primeng/api';
import {debounceTime} from 'rxjs';
import {Variable, VariableScope, VariableType} from '../../../../model/variable';
import {VariableService} from '../../../../service/variable.service';
import {ModalComponent} from '../../../../shared/modal';
import {ToastContainerComponent, ToastMode} from '../../../../shared/toast-container/toast-container.component';
import {UserDataService} from '../../../../service/userdata.service';
import {DomainService} from '../../../../service';

@Component({
    selector: 'app-variable-list',
    templateUrl: './variablelist.component.html',
    styleUrl: './variablelist.component.css',
    standalone: false
})
export class VariableListComponent implements OnInit, OnDestroy {

    public variables: Variable[] = [];

    public addedVariable: Variable = new Variable();

    public searchValue = '';

    public selectedScope: VariableScope = VariableScope.GLOBAL;

    public selectedDomain;

    public domainGlobalId;

    public domains = [];

    public readonly scopes = [
        {name: 'GLOBAL', value: VariableScope.GLOBAL},
        {name: 'DOMAIN', value: VariableScope.DOMAIN}
    ];

    public readonly types = [
        {name: 'STANDARD', value: VariableType.STANDARD},
        {name: 'SECRET', value: VariableType.SECRET}
    ];

    public isEditMode = false;

    public isViewMode = false;

    @ViewChild(ModalComponent, {static: true})
    public modal: ModalComponent;

    @ViewChild('rowMenu') rowMenu!: Menu;
    rowMenuItems: MenuItem[] = [];

    private pipeRefresh: any;

    constructor(private readonly service: VariableService,
                private readonly toast: ToastContainerComponent,
                public translate: TranslateService,
                public userDataService: UserDataService,
                public domainService: DomainService) {
    }

    ngOnInit() {
        this.domainGlobalId = this.domainService.getGlobalDomainId();
        this.domainService.getMyDomains().subscribe(result => {
            this.domains = result.filter(d => d.id !== this.domainService.getGlobalDomainId());
        });
        this.refreshList();
    }

    ngOnDestroy(): void {
        if (this.pipeRefresh) {
            this.pipeRefresh.unsubscribe();
        }
    }

    public refreshList() {
        this.pipeRefresh = this.userDataService.selectedDomainId
            .pipe(debounceTime(300))
            .subscribe((domainId) => {
                this.selectedDomain = domainId;
                if (this.selectedDomain !== this.domainGlobalId) {
                    this.selectedScope = VariableScope.DOMAIN;
                }
                this.loadVariables();
            });
    }

    public loadVariables() {
        const domainId = this.selectedScope === VariableScope.DOMAIN && this.selectedDomain !== this.domainGlobalId
            ? this.selectedDomain
            : undefined;
        this.service.getAll(this.selectedScope, domainId)
            .subscribe({
                next: (variables) => this.variables = variables,
                error: (error) => console.error('Error fetching variables:', error)
            });
    }

    public onScopeChange(scope: VariableScope) {
        this.selectedScope = scope;
        this.loadVariables();
    }

    public openViewModal(variable: Variable) {
        this.isEditMode = true;
        this.isViewMode = true;
        this.addedVariable = {...variable};
        if (this.addedVariable.scope === VariableScope.DOMAIN) {
            this.addedVariable.domainId = Number(variable.domainId);
        }
        this.modal.show();
    }

    public openModal() {
        this.isEditMode = false;
        this.isViewMode = false;
        this.addedVariable = new Variable();
        this.addedVariable.scope = this.selectedDomain === this.domainGlobalId
            ? VariableScope.GLOBAL
            : VariableScope.DOMAIN;
        this.addedVariable.type = VariableType.STANDARD;
        this.modal.show();
    }

    public closeModalAndSaveVariable() {
        if (!this.isEditMode) {
            if (this.addedVariable.scope === VariableScope.DOMAIN && this.selectedDomain !== this.domainGlobalId) {
                this.addedVariable.domainId = Number(this.selectedDomain);
            } else {
                this.addedVariable.domainId = undefined;
            }
        }

        if (this.isEditMode) {
            this.service.update(this.addedVariable).subscribe(() => {
                this.toast.show('TOAST.SUCCESS.NEW_VARIABLE', ToastMode.SUCCESS, 'TOAST.SUCCESS_HEADER');
                this.modal.hide();
                this.loadVariables();
            }, error => {
                console.error('Error updating variable:', error);
                this.toast.show('TOAST.ERROR.NEW_VARIABLE', ToastMode.DANGER, 'TOAST.ERROR_HEADER');
            });
        } else {
            this.service.create(this.addedVariable).subscribe(() => {
                this.toast.show('TOAST.SUCCESS.NEW_VARIABLE', ToastMode.SUCCESS, 'TOAST.SUCCESS_HEADER');
                this.modal.hide();
                this.addedVariable = new Variable();
                this.loadVariables();
            }, error => {
                console.error('Error creating variable:', error);
                this.toast.show('TOAST.ERROR.NEW_VARIABLE', ToastMode.DANGER, 'TOAST.ERROR_HEADER');
            });
        }
    }

    public openEditModal(variable: Variable) {
        this.isEditMode = true;
        this.isViewMode = false;
        this.addedVariable = {...variable};
        if (this.addedVariable.scope === VariableScope.DOMAIN) {
            this.addedVariable.domainId = Number(variable.domainId);
        }
        this.modal.show();
    }

    public removeVariable(id: number) {
        this.service.remove(id).subscribe(() => {
            this.loadVariables();
        }, error => {
            console.error('Error removing variable:', error);
        });
    }

    openRowMenu(event: Event, variable: Variable) {
        this.rowMenuItems = [
            {
                label: this.translate.instant('VARIABLES.EDIT'),
                command: () => this.openEditModal(variable)
            },
            {
                label: this.translate.instant('VARIABLES.REMOVE'),
                command: () => this.removeVariable(variable.id)
            }
        ];

        this.rowMenu.toggle(event);
    }

    public getDomainName(domainId: number): string {
        const domain = this.domains.find(d => d.id === Number(domainId));
        return domain ? domain.name : String(domainId);
    }

    public get filteredVariables(): Variable[] {
        const value = this.searchValue?.toLowerCase() || '';
        return this.variables.filter(variable =>
            variable.name?.toLowerCase().includes(value) ||
            variable.id?.toString().includes(value)
        );
    }

}
