import {Pipe, PipeTransform} from '@angular/core';
import {DomainGroupList} from '../../model/domaingroup';

@Pipe({
    name: 'searchDomainGroup',
    standalone: false
})
export class SearchDomainGroupPipe implements PipeTransform {

    transform(value: DomainGroupList[], searchValue: string): any[] {

        if (!value || !searchValue) {
            return value
        }

        const result = [];
        value.forEach( val => {
            if (val.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                val.codename.toLowerCase().includes(searchValue.toLowerCase())
            ) {
                result.push(val);
            }

        })
        return result;
    }
}
