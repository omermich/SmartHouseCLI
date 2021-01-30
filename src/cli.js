import detect from './detect';
import file from './file';
import {
    deviceListPath
} from './file';
import parse from './parse';
import perform from './peform';
import prompt from './prompt';

/**
 * Main program function, 
 * calls all relevant functions by order.
 * 
 * @param {array} args Raw arguments from command line.
 */
export async function cli(args) {

    // Get JSON object from saved file.
    let devicesObj = file.getJSON(deviceListPath);

    // Get input arguments from command line.
    let userInputs = parse.argsToInputs(args);

    // Show help menu if user enters 'smart-home help'
    if (userInputs.device == 'help')
        prompt.help(devicesObj);

    // Check for missing userInputs.
    detect.missingInputs(userInputs);

    // Check for invalid userInputs.
    detect.invalidInputs(userInputs, devicesObj);

    // Input should be valid and usable at this point.
    // Perform user command.
    perform[userInputs.action] (
        userInputs, devicesObj, deviceListPath
    );
}