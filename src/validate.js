import prompt from './prompt';

export default {
    
    missingInputs: (inputs) => {
        if (!inputs.device) {
            prompt.missingInput('device');
        }
        if (!inputs.action) {
            prompt.missingInput('action');
        }
        if (!inputs.key) {
            prompt.missingInput('key');
        }
        if (inputs.action == 'set' && !inputs.value) {
            prompt.missingInput('value', 'Expected value after \'set\' action');
        }
    },

    invalidInputs: (inputs, devices) => {

        // if invalid DEVICE entered.
        if (!Object.keys(devices).includes(inputs.device)) {
            prompt.invalidInput(inputs.device, 'device');
        }
    
        // if invalid ACTION entered.
        else if (!['get', 'set'].includes(inputs.action)) {
            prompt.invalidInput(inputs.action, 'action');
        }
    
        // if invalid KEY entered.
        else if (!Object.keys(devices[inputs.device]).includes(inputs.key)) {
            prompt.invalidInput(inputs.key, 'key');
    
        } else if (inputs.action == 'set') {
    
            const keyObj = devices[inputs.device][inputs.key];
            let error;
    
            if (keyObj.type == 'number') {
                if (!intValidation(inputs.value, keyObj.range)) {
                    error = 'Number is out of range or invalid';
                    prompt.invalidValue(inputs.value, error);
                }
                    
            }
            if (keyObj.type == 'string') {
                if (!stringValidation(inputs.value, keyObj.keywords)) {
                    error = 'Keyword unrecognized';
                    prompt.invalidValue(inputs.value, error);
                }
            }
        }
    },
}

/**
 * Returns whether received input is valid - 
 * Convertable to int and within object key range.
 */
function intValidation(input, range) {

    const intTest = /^\d+$/.test(input);
    if (!intTest) return false; // if not int convertable. 

    if (range.min !== undefined && range.max !== undefined) {
        const intInput = parseInt(input);
        return (intInput >= range.min && intInput <= range.max); // if inside range.
    }

    return true;
}

/**
 * Returns whether received string exists within object keywords.
 */
function stringValidation(input, keywords) {
    return keywords.includes(input);
}