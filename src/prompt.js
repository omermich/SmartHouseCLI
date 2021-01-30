import chalk from 'chalk';
import file, {
    deviceConfigPath
} from './file';

export default {
    help: (devicesObj) => {
        // Shows CLI Format.
        console.log('\n\tProper CLI format is as follows: %s',
            chalk.bold.cyan('\n  [ smart-home <device> <action> <property> <value> ]\n'));
        console.log(chalk.grey('action: \'get\' or \'set\'.'));
        console.log(chalk.grey('value: only relevant when action = \'set\'.\n\n'));

        const config = file.getJSON(deviceConfigPath);

        // Shows a table of configured devicesObj.

        console.log(chalk.bold.grey('-- ACTIVE DEVICES --\n'));
        console.log(chalk.yellow('NAME\t\tTYPE\n'));
        for (const device in devicesObj) {
            console.log('%s\t\t%s',
                chalk.bold.magenta(device),
                chalk.white(devicesObj[device].type));
        }

        console.log(chalk.bold.grey('\n\n-- DEVICE TYPES --\n'));
        console.log(chalk.yellow('DEVICE TYPE \t  PROPERTY \t    PROPERTY TYPE\n'));
        for (const deviceType in config.types) {
            console.log(chalk.bold.magenta(deviceType));
            for (const property of config.types[deviceType].properties) {
                console.log('\t\t  ' + chalk.bold(property));

                for (const propertyKey in config.properties[property]) {

                    const propertyValue = config.properties[property][propertyKey];
                    console.log('\t\t\t\t    %s: %s',
                        propertyKey, chalk.green(propertyValue));

                }
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

    get: (device, property, value) => {
        console.log('%s: %s.%s is %s\n',
            chalk.blue('GET'),
            device, property, value);
        process.exit(0);
    },

    set: (device, property, value) => {
        console.log('%s %s.%s set to %s\n',
            chalk.blue('SET:'),
            device, property, value);
        process.exit(0);
    },
}

function showInfo() {
    console.info('%s For help, enter: %s\n',
        chalk.green.bold('INFO:'),
        chalk.blueBright('smart-home help'));
}