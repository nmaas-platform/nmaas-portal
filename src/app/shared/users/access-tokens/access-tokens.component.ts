import {Component, OnInit, ViewChild} from '@angular/core';
import {Observable} from 'rxjs';
import {AccessToken} from './access-token';
import {AccessTokenService} from './access-token.service';
import {ModalComponent} from '../../modal';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-access-tokens',
    templateUrl: './access-tokens.component.html',
    styleUrls: ['./access-tokens.component.css']
})
export class AccessTokensComponent implements OnInit {

    public tokens: Observable<AccessToken[]> = undefined;
    public tokensList: AccessToken[] = [];

    public requestForm: UntypedFormGroup = undefined;

    public newTokenName = '';

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

    public createNewToken() {
        this.tokenService.createToken(this.requestForm.value.name.trim()).subscribe({
            next: val => {
                this.tokensList.push(val)
                this.requestForm.reset();
                this.modal.hide();
            },
            error: err => console.warn(err)
        })
    }

    get name() {
        return this.requestForm.get('name');
    }
}
