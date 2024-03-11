import { Component, OnInit } from '@angular/core';
import { DomainService } from '../../../service';
import { KeyValue } from '../../../model/key-value';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-domain-annotations',
  templateUrl: './domain-annotations.component.html',
  styleUrls: []
})
export class DomainAnnotationsComponent implements OnInit {

  public annotations: Observable<KeyValue[]> ;

  constructor(private readonly domainService: DomainService) { }

  ngOnInit(): void {

   this.annotations = this.domainService.getAnnotations();
  }

  public handleAnnotationsUpdate(event: any ) {
    console.warn(event)
  }

  public handleDelete(key: string) {
    console.warn("trigger delete for", key);
  }

}
