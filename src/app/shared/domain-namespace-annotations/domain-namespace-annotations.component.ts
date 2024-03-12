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

    @ViewChild('editModal')
    public readonly modalEdit: ModalComponent;

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

    public isKeyPatternCorrect = true;

    public newAnnotations : DomainAnnotation = new DomainAnnotation();

    public editAnnotation : DomainAnnotation = new DomainAnnotation();

    public constructor(private readonly domainService: DomainService) {

    }

    ngOnInit(): void {
        console.warn("annotations", this.annotationRead)
        this.annotationRead.subscribe(annotation =>{
            this.keyValue = annotation;
            this.checkDuplicate();
        })
    }

    public emmitValue(keyValue: DomainAnnotation) {
        this.checkDuplicate()
        if ( this.isKeysUnique && this.isKeyValuePresent) {
            this.annotations.emit(this.keyValue);
        }

        if(keyValue !== null) {
        
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
        this.newAnnotations.key =''
        this.newAnnotations.value = ''
        console.log(this.newAnnotations)
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

    public isKeyNotUniqueEdit(annotation: DomainAnnotation) {
        let annotationBefore = this.keyValue.find(val => val.id === annotation.id)
            if(annotation?.key === annotationBefore?.key) {
                return this.keyValue.filter(val => val.key === annotation.key).length > 1
            } else {
                return this.keyValue.filter(val => val.key === annotation.key).length > 0
            }
        
    }

    public isEditAnnotationCorrect(annotation: DomainAnnotation) {
        let annotationBefore = this.keyValue.find(val => val.id === annotation.id)
        if(annotation?.key === annotationBefore?.key && annotation?.value === annotationBefore?.value) {
            return true;
        } else {
            if(annotation?.key === annotationBefore?.key) {
                return this.keyValue.filter(val => val.key === annotation.key).length > 1
            } else {
                return this.keyValue.filter(val => val.key === annotation.key).length > 0
            }
        }
    }

    public isKeyNotUniqueAdd(annotation: DomainAnnotation) {
        if(annotation.key === '' || annotation.value === '') {
                return true;
        } else {
            return this.keyValue.some(val => val.key === annotation.key)
        }
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

    public openEditModal(annotation: DomainAnnotation) {
        this.editAnnotation = Object.assign({}, annotation) ;
        this.modalEdit.show();
    }

    public closeModalEdit() {
        if(this.globalSettings) {
            this.domainService.updateAnnotation(this.editAnnotation).subscribe( _ =>{
                this.editAnnotation = new DomainAnnotation();
                this.annotationRead = this.domainService.getAnnotations();
                this.triggerRefresh();
            })
        }else {
            this.keyValue = this.keyValue.filter(val => val.id !== this.editAnnotation.id)
            this.keyValue.push(this.editAnnotation);
            this.editAnnotation = new DomainAnnotation();
        }
        this.emmitValue(null)
        this.modalEdit.hide();
    }

    onKeyChange(value: string) {
        const pattern = /^[A-Za-z0-9_.-]+$/;
        if (!pattern.test(value)) {
            // Wartość nie spełnia wzorca, więc możesz podjąć odpowiednią akcję
            this.isKeyPatternCorrect = false; // Wyzerowanie wartości
        } else {
            this.isKeyPatternCorrect = true;
        }
        console.log(this.isKeyPatternCorrect)
    }
}
