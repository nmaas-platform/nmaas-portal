import { convertToParamMap, ParamMap, Params } from "@angular/router";
import { Observable, ReplaySubject } from "rxjs";

export class ActivatedRouteStub {
    // Use a ReplaySubject to share previous values with subscribers
    // and pump new values into the `paramMap` observable
    private readonly subject = new ReplaySubject<ParamMap>();
    private readonly subjectQuery = new ReplaySubject<ParamMap>();
    snapshot = {};
  
    constructor(initialParams?: Params, initialQueryParams?: Params) {
      this.setParamMap(initialParams);
    }
  
    /** The mock paramMap observable */
    readonly paramMap = this.subject.asObservable();
    readonly queryParamMap = this.subjectQuery.asObservable();
  
    /** Set the paramMap observables's next value */
    setParamMap(params?: Params) {
      this.subject.next(convertToParamMap(params));
    }
  
    setQueryParamMap(params?: Params) {
      this.subjectQuery.next(convertToParamMap(params));
    }

    get queryParams() : Observable<ParamMap> {
        return this.subject.asObservable();
    }
  }