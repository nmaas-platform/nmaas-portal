import {AuthService} from '../auth/auth.service';
import {Directive, Input, TemplateRef, ViewContainerRef} from '@angular/core';

class RoleState {
    public allowed: Array<string> = new Array<string>();
}
@Directive({
    selector: '[roles]',
    inputs: ['roles']
})
export class RolesDirective {

    private _allowed: Array<string> = new Array<string>();

    constructor(private _templateRef: TemplateRef<any>,
                private _viewContainer: ViewContainerRef,
                private authService: AuthService) {

    }

    @Input() set roles(allowedRoles: Array<string>) {
        this._allowed = allowedRoles;
        this.updateState({
            allowed: this._allowed
        })
    }

    updateState(state: RoleState) {
        this._viewContainer.clear();
    
    
        const hasAllowedRole = state.allowed.some(role => this.authService.hasRole(role));
        if (hasAllowedRole) {
            this._viewContainer.createEmbeddedView(this._templateRef);
        }
    }

}
