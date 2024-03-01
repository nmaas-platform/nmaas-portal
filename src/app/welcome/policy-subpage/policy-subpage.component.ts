import {AfterContentChecked, AfterViewChecked, Component, OnInit} from '@angular/core';
import {Content} from '../../model/content';
import {ContentDisplayService} from '../../service/content-display.service';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-policy-subpage',
  templateUrl: './policy-subpage.component.html',
  styleUrls: ['./policy-subpage.component.css']
})
export class PolicySubpageComponent implements OnInit, AfterViewChecked, AfterContentChecked {

  private height = 0;

  public content: Content;

  constructor(private contentDisplayService: ContentDisplayService,
              private translate: TranslateService,
              private activeRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.activeRoute.url.subscribe(urlElements => {
      const contentName = urlElements[urlElements.length - 1].path;
      this.onResize();
      this.getContent(contentName);
    });
  }

  ngAfterContentChecked() {
    this.onResize();
  }

  ngAfterViewChecked() {
    this.onResize();
  }

  getContent(contentName: string): void {
    this.contentDisplayService.getContent(contentName).subscribe(content => this.content = content);
  }

  onResize() {
    // TODO rewrite this component not to use 'document' - use css instead
    this.height = document.getElementById('global-footer').offsetHeight;
    document.getElementById('welcome-container').style.marginBottom = `${this.height * 9 / 10 + 5}px`;
  }

}
