import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TagFilterComponent } from './tagfilter.component';
import {TagService} from '../../../service';
import createSpyObj = jasmine.createSpyObj;
import {of} from 'rxjs';

describe('TagfilterComponent', () => {
  let component: TagFilterComponent;
  let fixture: ComponentFixture<TagFilterComponent>;
  let tagSpy: jasmine.SpyObj<TagService>;

  beforeEach(waitForAsync(() => {
    tagSpy = createSpyObj<TagService>(['getTags'])
    tagSpy.getTags.and.returnValue(of(['test']))
    TestBed.configureTestingModule({
      declarations: [ TagFilterComponent ],
      imports: [
      ],
      providers: [
        {provide: TagService, useClass: tagSpy}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
   expect(component).toBeTruthy();
 });
});
