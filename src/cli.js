import arg from 'arg';
import {
    initDevicesObj
} from './config';
import {
    showHelp
} from './help';
import prompt from './prompts';

function parseArgumentsIntoInputs(rawArgs) {

    let args;
    try {
        args = arg({}, {
            argv: rawArgs.slice(2)
        });
    } catch (error) {
        prompt.exception(error.toString(), 'Illegal characters entered')
    }
    

    return {

        device: args._[0], // main-tv | bed-tv | ac | pc | microwave

        action: args._[1], // get | set

        key: args._[2], // status | temp | channel | timer

        value: args._[3], // int or boolean, respective to the given device. 
        // only relevant if "action == set".
    };
}



function promptForMissingInputs(inputs) {
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
        prompt.missingInput
            ('value', 'Expected value after \'set\' action');
    }

}

function promptForInvalidInputs(inputs, devices) {

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

        // if invalid VALUE entered.
        if (!keyObj.valid(inputs.value)) {
            let error;
            if (keyObj.type == 'boolean') error = 'Keyword unrecognized';
            if (keyObj.type == 'number') error = 'Number is out of range or invalid'
            prompt.invalidValue(inputs.value, error);
        }
    }
}

// MAIN //
export async function cli(args) {

    let devices = initDevicesObj();

    let inputs = parseArgumentsIntoInputs(args);

    if (inputs.device == 'help')
        showHelp(inputs, devices);

    promptForMissingInputs(inputs);

    promptForInvalidInputs(inputs, devices);

    console.log(inputs);
}