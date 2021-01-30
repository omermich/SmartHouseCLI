import prompt from './prompt'
import file, {
    deviceConfigPath
} from './file';
import validate from './validate';

const action = {
    GET: 'get',
    SET: 'set'
};

export default {

    missingInputs: (userInputs) => {
        if (!userInputs.device) {
            prompt.missingInput('device');
        }
        if (!userInputs.action) {
            prompt.missingInput('action');
        }
        if (!userInputs.property) {
            prompt.missingInput('property');
        }
        if (userInputs.action == action.SET && !userInputs.value) {
            prompt.missingInput('value', 'Expected value after \'set\' action');
        }
    },

    invalidInputs: (userInputs, deviceObj) => {

        const config = file.getJSON(deviceConfigPath);

        // if invalid DEVICE entered.
        if (!Object.keys(deviceObj).includes(userInputs.device)) {
            prompt.invalidInput(userInputs.device, 'device');
        }

        // if invalid ACTION entered.
        if (!userInputs.action in action) {
            prompt.invalidInput(userInputs.action, 'action');
        }

        // if invalid PROPERTY entered.
        const chosenDeviceType = deviceObj[userInputs.device].type;
        const typeProperties = config.types[chosenDeviceType].properties;
        if (!typeProperties.includes(userInputs.property)) {
            prompt.invalidInput(userInputs.property, 'property');
        } 
        
        // if chosen action is SET, check if value fits into property type.
        if (userInputs.action == action.SET) {
            let error;

            const typeOfChosenProperty = config.properties[userInputs.property].type;

            // if property type is number.
            if (typeOfChosenProperty == 'number') {
                const range = config.properties[userInputs.property].range;
                if (!validate.number(userInputs.value, range)) {
                    error = 'Number is out of range or invalid';
                    prompt.invalidValue(userInputs.value, error);
                }
            }

            // if property type is on-off.
            if (typeOfChosenProperty == 'on-off') {
                if (!validate.onoff(userInputs.value)) {
                    error = 'Value unrecognized';
                    prompt.invalidValue(userInputs.value, error);
                }
            }
        }
    }
}