import {Pipe, PipeTransform} from '@angular/core';
import {BulkDeployment} from '../../../model/bulk-deployment';

@Pipe({
    name: 'searchBulk'
})
export class BulkSearchPipe implements PipeTransform {

    transform(value: BulkDeployment[], searchValue: string, appMode: boolean = false): any[] {

        if (!value || !searchValue) {
            return value
        }

        let result = [];
        if (appMode) {
            value.forEach( val => {
                if (val.creator.username.toLowerCase().includes(searchValue.toLowerCase()) ||
                    val.details['appName'].toLowerCase().includes(searchValue.toLowerCase())
                ) {
                    result.push(val);
                }
            })
        } else {
            return value;
        }

        return result;
    }
}
