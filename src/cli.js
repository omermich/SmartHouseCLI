import arg from 'arg';
import {
    initDevicesObj
} from './config';
import file from './file';
import prompt from './prompt';
import validate from './validate';

// Path of Smart-home devices JSON File.
const filePath = './bin/device-list.json';

/**
 * Parses raw arguments into an object later to be interpreted.
 * 
 * @param    {array}  rawArgs   Raw arguments from command line.
 * 
 * @returns  {object}           Object with members containing the user arguments,
 *                              respective to the given order: device, action, key, value.
 */
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
        device: args._[0],
        action: args._[1], 
        key: args._[2],
        value: args._[3],
    };
}

/**
 * Performs given action onto device object.
 * Saves to file if necessary.
 * 
 * @param {string} action   Action to perform (get / set).
 * @param {object} inputs   User inputs from the command line.
 * @param {object} devices  Devices object to perform the action on.
 */
function perform(action, inputs, devices) {
    let value;
    try {
        if (action == 'get') {
            value = devices[inputs.device][inputs.key].value;
        } else if (action == 'set') {
            value = inputs.value;
            devices[inputs.device][inputs.key].value = value;
            file.saveJSON(
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

/**
 * Main program function, 
 * calls all relevant functions by order.
 * 
 * @param {array} args Raw arguments from command line.
 */
export async function cli(args) {

    // Get JSON object from saved file.
    let devices = file.getJSON(filePath);

    // Get input arguments from command line.
    let inputs = parseArgumentsIntoInputs(args);

    // Show help menu if user enters 'smart-home help'
    if (inputs.device == 'help')
        prompt.help(inputs, devices);

    // Check for missing inputs.
    validate.missingInputs(inputs);

    // Check for invalid inputs.
    validate.invalidInputs(inputs, devices);

    // Input should be valid and usable at this point.
    // Perform user command.
    perform(inputs.action, inputs, devices);
}