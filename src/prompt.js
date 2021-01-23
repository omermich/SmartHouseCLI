import chalk from 'chalk';
import inquirer from 'inquirer';

export default {
    help: (inputs, devices) => {
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
    },

    missingInput: (missingInput, specialMsg) => {
        var errorMsg = '%s No %s entered. ';
        if (specialMsg !== undefined) errorMsg += specialMsg;
        console.error(errorMsg, chalk.red.bold('ERROR: '), missingInput);
        showInfo();
        process.exit(1);
    },

    invalidInput: (invalidInput, wrongParam) => {
        console.error('%s Unrecognized ' + wrongParam + ' \'' + invalidInput + '\'.', chalk.red.bold('ERROR:'));
        showInfo();
        process.exit(1);
    },

    invalidValue: (wrongParam, error) => {
        console.error('%s \'%s\': %s.', chalk.red.bold('ERROR'), wrongParam, error);
        showInfo();
        process.exit(1);
    },

    exception: (exc, err, exit) => {
        console.error('%s: \'%s\': %s. \n', chalk.red.bold('ERROR'), exc, err);
        if (exit === undefined || exit == true)
            process.exit(1);
    },

    get: (device, key, value) => {
        console.log('%s: %s.%s is %s\n',
            chalk.blue('GET'),
            device, key, value);
        process.exit(0);
    },

    set: (device, key, value) => {
        console.log('%s %s.%s set to %s\n',
            chalk.blue('SET:'),
            device, key, value);
        process.exit(0);
    },
}

function showInfo() {
    console.info('%s For help, enter: %s\n',
        chalk.green.bold('INFO:'),
        chalk.blueBright('smart-home help'));
}