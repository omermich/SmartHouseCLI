import arg from 'arg';
import prompt from "./prompt";

export default {

    /**
     * Parses raw arguments into an object later to be interpreted.
     * 
     * @param    {array}  rawArgs   Raw arguments from command line.
     * 
     * @returns  {object}           Object with members containing the user arguments,
     *                              respective to the given order: device, action, key, value.
     */
    argsToInputs: (rawArgs) => {

        let args;
        try {
            args = arg({}, {
                argv: rawArgs.slice(2)
            });
        } catch (error) {
            prompt.exception(error.toString(), 'Illegal characters entered')
        }

        return {
            device: args._[0],
            action: args._[1],
            property: args._[2],
            value: args._[3],
        };
    }
}