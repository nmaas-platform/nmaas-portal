import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {KeyValue} from '../../model/key-value';

@Component({
    selector: 'app-domain-namespace-annotations',
    templateUrl: './domain-namespace-annotations.component.html',
    styleUrls: ['./domain-namespace-annotations.component.css']
})
export class DomainNamespaceAnnotationsComponent implements OnInit {

    @Input()
    public annotationRead: KeyValue[];

    @Output()
    public annotations: EventEmitter<KeyValue[]> = new EventEmitter<KeyValue[]>();

    public keyValue: KeyValue[] = []

    private keySetNotUnique: string[] = [];

    public isKeysUnique = true;

    constructor() {
    }

    ngOnInit(): void {
    }

    public emmitValue() {
        this.checkDuplicate()
        if ( this.isKeysUnique) {
            this.annotations.emit(this.keyValue);
        }
    }

    public checkDuplicate() {
        const keySet = new Set<string>();
        this.keyValue.forEach(kv => {
            if (keySet.has(kv.key)) {
                console.error("duplicated keys in annotations")
                this.isKeysUnique = false;
                this.keySetNotUnique.push(kv.key)
            } else {
                keySet.add(kv.key)
            }
        })
        if (this.keyValue.length === keySet.size) {
            this.isKeysUnique = true;
            this.keySetNotUnique = [];
        }
        console.warn("after checking", this.isKeysUnique, keySet)
    }

    showModal() {

    }

    addAnnotation() {
        this.keyValue.push(new KeyValue())
    }

    deleteAnnotation(key: any) {
        this.keyValue = this.keyValue.filter(val => val.key !== key)
    }

   public isKeyNotUnique(key: string) {
        return this.keySetNotUnique.some(val => val === key)
    }

}
