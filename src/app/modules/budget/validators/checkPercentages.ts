import { nullSafeIsEquivalent } from '@angular/compiler/src/output/output_ast';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const checkPercentages: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    let total = 0;
    let food = Number(group.get('food')?.value);
    let insurance = Number(group.get('insurance')?.value);
    let personal = Number(group.get('personal')?.value);
    let saving = Number(group.get('saving')?.value);
    let transportation = Number(group.get('transportation')?.value);
    let utilities = Number(group.get('utilities')?.value);
    let housing = Number(group.get('housing')?.value);
    let misc = Number(group.get('misc')?.value);

    total = food + insurance + personal + saving + transportation + utilities + housing + misc;
    console.log(`Total: ${total}`)
    return total <= 100 ? null : { tooGreat: true }
};