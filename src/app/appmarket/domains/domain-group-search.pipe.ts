import {Pipe, PipeTransform} from '@angular/core';
import {DomainGroup} from '../../model/domaingroup';

@Pipe({
    name: 'searchDomainGroup'
})
export class SearchDomainGroupPipe implements PipeTransform {

    transform(value: DomainGroup[], searchValue: string): any[] {

        if (!value || !searchValue) {
            return value
        }

        const result = [];
        value.forEach( val => {
            if (val.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                val.codename.toLowerCase().includes(searchValue.toLowerCase()) ||
                val.domains.some(domain => domain.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                domain.codename.toLowerCase().includes(searchValue.toLowerCase()))
            ) {
                result.push(val);
            }

        })
        return result;
    }
}
