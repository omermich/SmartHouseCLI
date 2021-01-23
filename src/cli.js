import arg from 'arg';
import {
    initDevicesObj
} from './config';
import prompt from './prompt';

var fs = require('fs');
const filePath = './bin/device-list.json';

// function initFile(filePath) {
//     fs.access(filePath, fs.constants.F_OK, (err) => {
//         if (err) {
//             console.error(
//                 `${file} ${err.code === 'ENOENT' ? 'does not exist' : 'is read-only'}`);
//         }
//     });
// }

function getJSONFromFile(path) {

    if (!fs.existsSync(path)) { // file missing.
        prompt.exception(path, 'File missing');
    }

    let data, json;
    try {
        data = fs.readFileSync(path);
        json = JSON.parse(data);
    } catch (err) {
        prompt.exception(err.toString(), 'Error reading file. Resetting Devices.', false);
        json = initDevicesObj();
        saveJSONToFile(path, json);
    }
    return json;
}

function saveJSONToFile(path, json) {
    const str = JSON.stringify(json);
    fs.writeFileSync(path, str);
}

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
        prompt.missingInput('value', 'Expected value after \'set\' action');
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

function stringValidation(input, keywords) {
    return keywords.includes(input);
}


/**
 * 
 * @param {string} action   The action to perform (get / set).
 * @param {object} inputs   The inputs to 
 * @param {object} devices 
 */
function perform(action, inputs, devices) {
    let value;
    try {
        if (action == 'get') {
            value = devices[inputs.device][inputs.key].value;
        } else if (action == 'set') {
            value = inputs.value;
            devices[inputs.device][inputs.key].value = value;
            saveJSONToFile(
                filePath, devices
            );
        }
    } catch (error) {
        prompt.exception(error.toString(),
            'Unexpected excpetion. Please try again');
    }

    prompt[inputs.action](
        inputs.device,
        inputs.key,
        value
    );

}

/* MAIN */
export async function cli(args) {

    // Get JSON object from file.
    let devices = getJSONFromFile(filePath);

    // Get input arguments from command line.
    let inputs = parseArgumentsIntoInputs(args);

    // Show help menu if user enters 'smart-home help'
    if (inputs.device == 'help')
        prompt.help(inputs, devices);

    // Check for missing inputs.
    promptForMissingInputs(inputs);

    // Check for invalid inputs.
    promptForInvalidInputs(inputs, devices);

    // Input should be valid and usable at this point.
    // Perform user command.
    perform(inputs.action, inputs, devices);
}