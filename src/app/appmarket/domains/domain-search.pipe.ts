import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'searchDomain'
})
export class SearchDomainPipe implements PipeTransform {

    transform(value: any[], searchValue: string): any[] {

        if (!value || !searchValue) {
            return value
        }
        console.log(searchValue)

        const result = [];
        value.forEach( val => {
            if (val.name.toLowerCase().includes(searchValue.toLowerCase())
            ) {
                result.push(val);
            }

        })
        console.warn(result)
        return result;
    }
}
