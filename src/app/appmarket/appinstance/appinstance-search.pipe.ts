import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'searchAppInstance'
})
export class AppinstanceSearchPipe implements PipeTransform {

    transform(value: any[], searchValue: string, ): any[] {

        if (!value || !searchValue) {
            return value
        }

        let result = [];
        value.forEach( val => {
            if (val.name.toLowerCase().includes(searchValue.toLowerCase() ||
                val.applicationName.toLowerCase().includes(searchValue.toLowerCase()) ||
                val.id.toLowerCase().includes(searchValue.toLowerCase()))
            ) {
                result.push(val);
            }

        })

        return result;
    }
}
