import prompt from './prompt';
var fs = require('fs');

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
            prompt.exception(err.toString(), 'Error reading file. Resetting Devices.', false);
            json = initDevicesObj();
            save(path, json);
        }
        return json;
    },

    saveJSON: (path, json) => {
        save(path, json);
    },
}

/**
 * Stringifies JSON and saves it into file.
 */
function save(path, json) {
    const str = JSON.stringify(json, null, 4);
    fs.writeFileSync(path, str);
}