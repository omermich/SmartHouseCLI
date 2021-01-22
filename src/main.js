import chalk from 'chalk';
import fs from 'fs';
import ncp from 'ncp';
import path from 'path';
import {promisify} from 'util';

const access = promisify(fs.access);
const copy = promisify(ncp);

async function copyTemplateFiles(options) {
    return copy(options.copyTemplateFiles, options.targetDirectory, {
        clobber: false,
    });

}

export async function smartHome(options) {
    options = {
        ...options,
        targetDirectory: options.targetDirectory || process.cwd(),
    };

    const currentFileUrl = import.meta.url;
    const templateDir = path.resolve(
        new URL(currentFileUrl).pathname,
        '../../templates',
        options.template.toLowerCase()
    );
    options.templateDirectory = templateDir;

    try {
        await access(templateDir, fs.constants.R_OK);
    } catch (err) {
        console.error('%s Invalid Template Name', chalk.red.bold('ERROR'));
        process.exit(1);
    }

    console.log('Copying project files.');
    await copyTemplateFiles(options);

    console.log('%s Project ready.', chalk.green.bold('DONE'));
    return true;
}