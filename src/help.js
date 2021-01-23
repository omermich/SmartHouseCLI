import chalk from 'chalk';

/**
 * Shows helping guide,
 *  in case user entered command 'smart-home help'.
 */
export function showHelp(inputs, devices) {
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