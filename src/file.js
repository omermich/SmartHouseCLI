import prompt from './prompt';
var fs = require('fs');

export default {
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

function save (path, json) {
    const str = JSON.stringify(json);
    fs.writeFileSync(path, str);
}