import {TagService} from '../../../service';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {map} from 'rxjs/operators';

@Component({
    selector: 'nmaas-tag-filter',
    templateUrl: './tagfilter.component.html',
    styleUrls: []
})
export class TagFilterComponent implements OnInit {

    @Input()
    public value = 'all';

    public all = 'all';

    @Output()
    public changed: EventEmitter<string> = new EventEmitter<string>();

    public tagsValue: string[];

    constructor(private tagService: TagService) {
    }

    ngOnInit() {
        this.tagService.getTags().pipe(map(tags => {
            tags.sort((a, b) => a < b ? -1 : 1)
            return tags;
        })).subscribe(value => this.tagsValue = value)
    }

    public onChange(): void {
        this.changed.emit(this.value);
    }

}
