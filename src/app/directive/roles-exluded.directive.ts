import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Directive({
  selector: '[rolesExcluded]'
})
export class RolesExcludedDirective {
  private _excluded: Array<string> = [];

  constructor(
    private _templateRef: TemplateRef<any>,
    private _viewContainer: ViewContainerRef,
    private authService: AuthService
  ) {}

  @Input() set rolesExcluded(excludedRoles: Array<string>) {
    this._excluded = excludedRoles;
    this.updateState();
  }

  private updateState() {
    this._viewContainer.clear();

    const hasExcludedRole = this._excluded.some(role => this.authService.hasRole(role));
    if (!hasExcludedRole) {
      // If user has exluded role hide the element 
      this._viewContainer.createEmbeddedView(this._templateRef);
    } 
  }
}