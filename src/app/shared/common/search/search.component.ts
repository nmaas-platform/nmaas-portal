import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'nmaas-inline-search',
    templateUrl: './search.component.html',
    styleUrls: []
})
export class SearchComponent {

    @Input()
    public value: string;

    @Output()
    public submitted: EventEmitter<string> = new EventEmitter<string>();

    @Output()
    public changed: EventEmitter<string> = new EventEmitter<string>();


    public onSubmit(): void {
        this.submitted.emit(this.value);
    }

    public onChange(): void {
        this.changed.emit(this.value);
    }

}
