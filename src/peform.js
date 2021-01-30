import file from "./file";
import prompt from "./prompt";

export default {
    /**
     * Gets value of property of given device.
     * Prompts the value to the user.
     * 
     * @param {object} userInputs  User inputs from the command line.
     * @param {object} devicesObj  Object to perform the action on.
     */
    get: (userInputs, devicesObj) => {
        let value;
        try {
            value = devicesObj[userInputs.device][userInputs.property];
        } catch (error) {
            prompt.exception(error.toString(),
                'Unexpected excpetion. Please try again');
        }

        prompt.get(
            userInputs.device,
            userInputs.property,
            value
        );
    },

    /**
     * Sets value to property of given device.
     * Saves the object in the given file path.
     * 
     * @param {object} userInputs  Inputs from the command line.
     * @param {object} devicesObj  Object to perform the action on.
     * @param {string} path        File path in which to save the object.
     */
    set: (userInputs, devicesObj, path) => {
        try {
            devicesObj[userInputs.device][userInputs.property] = userInputs.value;
            file.saveJSON(
                path, devicesObj
            );
        } catch (error) {
            prompt.exception(error.toString(),
                'Unexpected excpetion. Please try again');
        }

        prompt.set(
            userInputs.device,
            userInputs.property,
            userInputs.value
        );
    }
}