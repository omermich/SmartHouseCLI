import chalk from 'chalk';
import inquirer from 'inquirer';

export default {
    missingInput: (missingInput, specialMsg) => {
        var errorMsg = '%s No %s entered. ';
        if (specialMsg !== undefined) errorMsg += specialMsg;
        console.error(errorMsg, chalk.red.bold('ERROR: '), missingInput);
        console.info('%s For help, enter: %s\n',
            chalk.green.bold('INFO:'),
            chalk.blueBright('smart-home help'));
        process.exit(1);
    },
    
    invalidInput: (invalidInput, wrongParam) => {
        console.error('%s Unrecognized ' + wrongParam + ' \'' + invalidInput + '\'.', chalk.red.bold('ERROR:'));
        console.info('%s For help, enter: %s\n',
            chalk.green.bold('INFO:'),
            chalk.blueBright('smart-home help'));
        process.exit(1);
    },
    
    invalidValue: (wrongParam, error) => {
        console.error('%s \'%s\': %s.', chalk.red.bold('ERROR'), wrongParam, error);
        console.info('%s For help, enter: %s\n',
            chalk.green.bold('INFO:'),
            chalk.blueBright('smart-home help'));
        process.exit(1);
    },

    exception: (exc, err) => {
        console.error('%s \'%s\': %s.', chalk.red.bold('ERROR'), exc, err);
        console.info('%s For help, enter: %s\n',
            chalk.green.bold('INFO:'),
            chalk.blueBright('smart-home help'));
        process.exit(1);
    },
}