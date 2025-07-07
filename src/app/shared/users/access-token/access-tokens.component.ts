
import {Component, OnInit, ViewChild} from '@angular/core';
import {Observable} from 'rxjs';
import {AccessToken} from './access-token';
import {AccessTokenService} from './access-tokens.service';
import {ModalComponent} from '../../modal';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-access-tokens',
    templateUrl: './access-tokens.component.html',
    styleUrls: [],
    standalone: false
})
export class AccessTokensComponent implements OnInit {

    public tokens: Observable<AccessToken[]> = undefined;
    public tokensList: AccessToken[] = [];

    public requestForm: UntypedFormGroup = undefined;

    public newTokenName = '';

    public showCopyToken = false;
    public newToken :AccessToken;

    @ViewChild(ModalComponent, {static: true})
    public readonly modal: ModalComponent;

    constructor(private tokenService: AccessTokenService,
                private formBuilder: UntypedFormBuilder) {
    }

    ngOnInit() {
        this.requestForm = this.formBuilder.group({
            name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(16)]],
        })

        this.tokens = this.tokenService.getAll();
        this.getData();
    }

    getData() {
        this.tokensList = [];
        this.tokens.subscribe(
            data => this.tokensList.push(...data),
            error => console.error(error)
        )
    }

    invalidate(id: number) {
        this.tokenService.invalidate(id).subscribe(
            (_) => this.getData(),
            error => console.error(error)
        );
    }

    deleteToken(id: number) {
        this.tokenService.deleteToken(id).subscribe(
            (_) => this.getData(),
            error => console.error(error.err)
        );
    }

    public createNewToken() {
        this.tokenService.createToken(this.requestForm.value.name.trim()).subscribe({
            next: val => {
                this.requestForm.reset();
                this.showCopyToken = true;
                this.newToken = val;
            },
            error: err => {
                console.warn(err.error)
                this.requestForm.controls['name'].setErrors({notUnique: true, message: err.error}); 
                console.log(this.requestForm)
            }
        })
    }

    public copyToClipboard() {
        if (this.newToken.tokenValue) {
            navigator.clipboard.writeText(this.newToken.tokenValue).then(() => {
                console.log('Copied to clipbord');
            }, (err) => {
                console.error('Some errors accoured: ', err);
            });
        }
    }

    public ConfirmAndClose() {
        this.showCopyToken = false;
        this.newToken = null;
        this.getData();
        this.modal.hide();
       
    }

    get name() {
        return this.requestForm.get('name');
    }
}