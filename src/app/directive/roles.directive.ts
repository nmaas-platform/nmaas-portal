import {AuthService} from '../auth/auth.service';
import {Directive, Input, TemplateRef, ViewContainerRef} from '@angular/core';

class RoleState {
    public allowed: Array<string> = new Array<string>();
    public excluded: Array<string> = new Array<string>()
}


@Directive({
    selector: '[roles]',
    inputs: ['roles']
})
export class RolesDirective {

    private _allowed: Array<string> = new Array<string>();

    private _excluded: Array<string> = new Array<string>();

    constructor(private _templateRef: TemplateRef<any>,
                private _viewContainer: ViewContainerRef,
                private authService: AuthService) {

    }

    @Input() set roles(allowedRoles: Array<string>) {
        this._allowed = allowedRoles;
        this.updateState({
            allowed: this._allowed,
            excluded: this._excluded
        })
    }

    // Excluded roles have priority than allowed roles
    // If user have excluded role template would not be shown

    @Input() set rolesExcluded(excluded: Array<string>) {
        this._excluded = excluded;
        this.updateState({
            allowed: this._allowed,
            excluded: this._excluded
        })
    }

    updateState(state: RoleState) {
        this._viewContainer.clear();

        let show: boolean = false;
        let notAllowed: boolean = false;

        const allowedRoles = state.allowed;

        for (let exclude of state.excluded) {
            if (this.authService.hasRole(exclude)) {
                notAllowed = true;
                break;
            }
        }
        if (notAllowed) {
            this._viewContainer.clear();
        } else {
            for (let allowedRole of allowedRoles) {
                if (this.authService.hasRole(allowedRole)) {
                    show = true;
                    break;
                }
            }

            if (show) {
                this._viewContainer.createEmbeddedView(this._templateRef);
            } else {
                this._viewContainer.clear();
            }
        }

    }

}
