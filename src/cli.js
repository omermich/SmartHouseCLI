import arg from 'arg';
import chalk from 'chalk';
import inquirer from 'inquirer';
import {
    initDevicesObj
} from './config';

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
    console.error(errorMsg, chalk.red.bold('ERROR:'), missingInput);
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

function showInvalidInputPrompt(invalidInput) {
    console.error('%s Unrecognized device \'' + invalidInput + '\'.', chalk.red.bold('ERROR'));
    process.exit(1);
}

function promptForInvalidInputs(inputs, devices) {

    const questions = [];

    // if invalid DEVICE entered.
    if (!Object.keys(devices).includes(inputs.device)) {
        showInvalidInputPrompt(inputs.device);
    }

    // if invalid ACTION entered.
    else if (!['get', 'set'].includes(inputs.action)) {
        showInvalidInputPrompt(inputs.action);
    }

    // if invalid KEY entered.
    else if (!Object.keys(devices[inputs.device]).includes(inputs.key)) {
        showInvalidInputPrompt(inputs.key);
    } else if (inputs.action == 'set') {

        // if invalid VALUE entered.
        keyObj = devices[inputs.device][inputs.key];
        if (keyObj.type == 'boolean') {
            if (!['on', 'off'].includes(inputs.value)) {

            }
        }

    }
}

/**
 * Shows helping guide,
 *  in case user entered command 'smart-home help'.
 */
function showHelp(inputs, devices) {
    if (inputs.device == 'help') {

        // Shows CLI Format.
        console.log('\n\tProper CLI format is as follows: %s',
            chalk.bold.cyan('\n  [ smart-home <device> <action> <key> <value> ]\n'));
        console.log(chalk.grey('action: \'get\' or \'set\'.'));
        console.log(chalk.grey('value: only relevant when action = \'set\'.\n\n'));

        // Shows a table of configured devices.
        console.log(chalk.yellow('DEVICE\t  KEY\t    CRITERIA\n'));
        for (const device in devices) {
            console.log(chalk.bold.magenta(device));
            for (const key in devices[device]) {
                console.log('\t  ' + chalk.bold(key));
                const keyObj = devices[device][key];
                console.log('\t\t    Type: %s',
                    chalk.green(keyObj.type));

                    // if boolean, show accepted keywords.
                if (keyObj.type == 'boolean') {
                    console.log('\t\t    Keywords: %s', chalk.hex('#80EE80')(
                        keyObj.keywords[0] + ', ' +
                        keyObj.keywords[1]));
                }

                    // if number, show accepted range.
                if (keyObj.type == 'number')
                    console.log('\t\t    Range: %s', chalk.hex('#80EE80')(
                        keyObj.range.min + ' - ' +
                        keyObj.range.max));
            }
        }
        console.log('\n');
        process.exit(0);
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