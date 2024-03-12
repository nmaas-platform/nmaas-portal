import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {KeyValue} from '../../model/key-value';
import { Observable, of } from 'rxjs';
import { DomainAnnotation } from '../../model/domain-annotation';
import { ModalComponent } from '../modal';
import { DomainService } from '../../service';

@Component({
    selector: 'app-domain-namespace-annotations',
    templateUrl: './domain-namespace-annotations.component.html',
    styleUrls: ['./domain-namespace-annotations.component.css']
})
export class DomainNamespaceAnnotationsComponent implements OnInit {

    @ViewChild(ModalComponent, {static: true})
    public readonly modal: ModalComponent;

    @Input()
    public annotationRead: Observable<DomainAnnotation[]> = of([]);

    @Input()
    public globalSettings: boolean = false;

    @Output()
    public annotations: EventEmitter<DomainAnnotation[]> = new EventEmitter<DomainAnnotation[]>();

    @Output()
    public trigerDelete: EventEmitter<string> = new EventEmitter<string>();

    public keyValue: DomainAnnotation[] = []

    private keySetNotUnique: string[] = [];

    public isKeysUnique = true;
    public isKeyValuePresent =true;

    public newAnnotations : DomainAnnotation = new DomainAnnotation();

    public reaOnlyMap = new Map<string, boolean>();

    public constructor(private readonly domainService: DomainService) {

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

    public emmitValue(keyValue: DomainAnnotation) {
        this.checkDuplicate()
        if ( this.isKeysUnique && this.isKeyValuePresent) {
            this.annotations.emit(this.keyValue);
        }

        if(keyValue !== null) {
            if(keyValue.key !== "") {
                this.reaOnlyMap.set(keyValue.key, true);
            }
    
            if(this.globalSettings) {
                this.domainService.updateAnnotation(keyValue).subscribe(_=> {
                    console.warn("Updated annotation", keyValue)
                })
            }
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
        this.newAnnotations = new DomainAnnotation();
        this.modal.show();
    }

    deleteAnnotation(id: any) {
        this.keyValue = this.keyValue.filter(val => val.id !== id)
        this.trigerDelete.emit(id);
        if(this.globalSettings){
            this.domainService.deleteAnnotation(id).subscribe(_=>{
                this.annotationRead = this.domainService.getAnnotations();
            })
        }
    }

   public isKeyNotUnique(key: string) {
        return this.keySetNotUnique.some(val => val === key)
    }

    public isKeyNotUniqueAdd(key: string) {
        return this.keyValue.some(val => val.key === key)
    }

    public getReadOnlyValue(key: string) {
        if(this.reaOnlyMap.has(key)){
            return this.reaOnlyMap.get(key);
        } else return false;
    }

    public closeModal() {
        if(this.globalSettings) {
            this.domainService.addAnnotations(this.newAnnotations).subscribe(_ => {
                console.log("Send request to create new annotations", this.newAnnotations)
                this.newAnnotations = new DomainAnnotation();
                this.annotationRead = this.domainService.getAnnotations();
                this.triggerRefresh();
            })
        } else {
            this.keyValue.push(this.newAnnotations)
            this.newAnnotations = new DomainAnnotation();
        }
        this.emmitValue(null);
        this.modal.hide();
    }

    public triggerRefresh() {
        this.annotationRead.subscribe(annotation =>{
            this.keyValue = annotation;
    })
    }
}
