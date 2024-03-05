import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {KeyValue} from '../../model/key-value';
import { Observable } from 'rxjs';
import { AnonymousSubject } from 'rxjs/internal/Subject';

@Component({
    selector: 'app-domain-namespace-annotations',
    templateUrl: './domain-namespace-annotations.component.html',
    styleUrls: ['./domain-namespace-annotations.component.css']
})
export class DomainNamespaceAnnotationsComponent implements OnInit {

    @Input()
    public annotationRead: Observable<KeyValue[]>;

    @Input()
    public globalSettings: boolean = false;

    @Output()
    public annotations: EventEmitter<KeyValue[]> = new EventEmitter<KeyValue[]>();

    @Output()
    public trigerDelete: EventEmitter<String> = new EventEmitter<String>();

    public keyValue: KeyValue[] = []

    private keySetNotUnique: string[] = [];

    public isKeysUnique = true;
    public isKeyValuePresent =true;

    public reaOnlyMap = new Map<String, boolean>();

    constructor() {
    }

    ngOnInit(): void {
        console.warn("annotations", this.annotationRead)
        this.annotationRead.subscribe(annotation =>{
            this.keyValue = annotation;
            annotation.forEach(ann => {
                this.reaOnlyMap.set(ann.key,true);
            })
        })
    }

    public emmitValue(key: string = "") {
        this.checkDuplicate()
        if ( this.isKeysUnique && this.isKeyValuePresent) {
            this.annotations.emit(this.keyValue);
        }
        if(key !== "") {
            this.reaOnlyMap.set(key, true);
        }
    }

    public checkDuplicate() {
        const keySet = new Set<string>();
        this.isKeyValuePresent = true;
        this.keyValue.forEach(kv => {
            if (keySet.has(kv.key)) {
                console.error("duplicated keys in annotations")
                this.isKeysUnique = false;
                this.keySetNotUnique.push(kv.key)
            } else {
                keySet.add(kv.key)
            }
            console.warn("check duplicate",kv, kv.hasOwnProperty('value'))
            if(kv.value === null || !kv.hasOwnProperty('value')) {
                this.isKeyValuePresent = false;
            }
        })
        if (this.keyValue.length === keySet.size) {
            this.isKeysUnique = true;
            this.keySetNotUnique = [];
        }
        console.warn("after checking", this.isKeysUnique, keySet)
    }

    addAnnotation() {
        this.keyValue.push(new KeyValue())
    }

    deleteAnnotation(key: any) {
        this.keyValue = this.keyValue.filter(val => val.key !== key)
        if(this.globalSettings) {
            this.trigerDelete.emit(key);
        }
    }

   public isKeyNotUnique(key: string) {
        return this.keySetNotUnique.some(val => val === key)
    }

    public getReadOnlyValue(key: string) {
        if(this.reaOnlyMap.has(key)){
            return this.reaOnlyMap.get(key);
        } else return false;
    }

}
