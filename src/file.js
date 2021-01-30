import prompt from './prompt';
var fs = require('fs');

export const deviceListPath = './conf/device-list.json';
export const deviceConfigPath = './conf/device-config.json';

export default {
    /**
     * Reads text from file and returns it as a JSON object.
     */
    getJSON: (path) => {

        if (!fs.existsSync(path)) { // file missing.
            prompt.exception(path, 'File missing');
        }

        let data, json;
        try {
            data = fs.readFileSync(path);
            json = JSON.parse(data);
        } catch (err) {
            prompt.exception(err.toString(), 'Error reading file.', true);
        }
        return json;
    },

    saveJSON: (path, json) => {

        if (!fs.existsSync(path)) { // file missing.
            prompt.exception(path, 'File missing');
        }

        const str = JSON.stringify(json, null, 4);
        fs.writeFileSync(path, str);
    }
}