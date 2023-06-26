import { TagService } from '../../../service/tag.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import {sort} from 'semver';
import {map} from 'rxjs/operators';

@Component({
  selector: 'nmaas-tag-filter',
  templateUrl: './tagfilter.component.html',
  styleUrls: ['./tagfilter.component.css']
})
export class TagFilterComponent implements OnInit {

  @Input()
  public value = 'all';

  public all = 'all';

  @Output()
  public changed: EventEmitter<string> = new EventEmitter<string>();

  public tagsValue: string[];

  constructor(private tagService: TagService) { }

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
