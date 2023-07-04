import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'searchDomain'
})
export class SearchDomainPipe implements PipeTransform {

    transform(value: any[], searchValue: string, showNotActive: boolean): any[] {

        if (!value || !searchValue) {
            if (!showNotActive && value) return value.filter(val => val.active !== false)
            return value
        }

        let result = [];
        value.forEach( val => {
            if (val.name.toLowerCase().includes(searchValue.toLowerCase())
            ) {
                result.push(val);
            }

        })

        if (!showNotActive) {
            result = result.filter(val => val.active !== false)
        }
        return result;
    }
}
