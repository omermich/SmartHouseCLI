import arg from 'arg';
import chalk from 'chalk';
import inquirer from 'inquirer';
import {
    initDevicesObj
} from './config';
import {
    showHelp
} from './help';

function parseArgumentsIntoInputs(rawArgs) {

    const args = arg({}, {
        argv: rawArgs.slice(2)
    });

    return {

        device: args._[0], // main-tv | bed-tv | ac | pc | microwave

        action: args._[1], // get | set

        key: args._[2], // status | temp | channel | timer

        value: args._[3], // int or boolean, respective to the given device. 
        // only relevant if "action == set".
    };
}

function showMissingInputPrompt(missingInput, specialMsg) {
    var errorMsg = '%s No %s entered. ';
    if (specialMsg !== undefined) errorMsg += specialMsg;
    console.error(errorMsg, chalk.red.bold('ERROR: '), missingInput);
    console.info('%s For help, enter: %s\n',
        chalk.green.bold('INFO:'),
        chalk.blueBright('smart-home help'));
    process.exit(1);
}

function promptForMissingInputs(inputs) {
    if (!inputs.device) {
        showMissingInputPrompt('device');
    }
    if (!inputs.action) {
        showMissingInputPrompt('action');
    }
    if (!inputs.key) {
        showMissingInputPrompt('key');
    }
    if (inputs.action == 'set' && !inputs.value) {
        showMissingInputPrompt
            ('value', 'Expected value after \'set\' action');
    }

}

function showInvalidInputPrompt(invalidInput, wrongParam) {
    console.error('%s Unrecognized ' + wrongParam + ' \'' + invalidInput + '\'.', chalk.red.bold('ERROR:'));
    console.info('%s For help, enter: %s\n',
        chalk.green.bold('INFO:'),
        chalk.blueBright('smart-home help'));
    process.exit(1);
}

function showInvalidValuePrompt(wrongParam, error) {
    console.error('%s \'%s\': %s.', chalk.red.bold('ERROR'), wrongParam, error);
    console.info('%s For help, enter: %s\n',
        chalk.green.bold('INFO:'),
        chalk.blueBright('smart-home help'));
    process.exit(1);
}

function promptForInvalidInputs(inputs, devices) {

    // if invalid DEVICE entered.
    if (!Object.keys(devices).includes(inputs.device)) {
        showInvalidInputPrompt(inputs.device, 'device');
    }

    // if invalid ACTION entered.
    else if (!['get', 'set'].includes(inputs.action)) {
        showInvalidInputPrompt(inputs.action, 'action');
    }

    // if invalid KEY entered.
    else if (!Object.keys(devices[inputs.device]).includes(inputs.key)) {
        showInvalidInputPrompt(inputs.key, 'key');

    } else if (inputs.action == 'set') {

        const keyObj = devices[inputs.device][inputs.key];

        // if invalid VALUE entered.
        if (!keyObj.valid(inputs.value)) {
            let error;
            if (keyObj.type == 'boolean') error = 'Keyword unrecognized';
            if (keyObj.type == 'number') error = 'Number is out of range or invalid'
            showInvalidValuePrompt(inputs.value, error);
        }
    }
}

// MAIN //
export async function cli(args) {
    var devices = initDevicesObj();
    let inputs = parseArgumentsIntoInputs(args);
    //inputs = await promptForIncompleteArgs(inputs, devices);
    showHelp(inputs, devices);
    promptForMissingInputs(inputs);
    promptForInvalidInputs(inputs, devices);
    console.log(inputs);
}