export default {

    /**
     * Returns whether received input is valid - 
     * Convertable to int and within object key range.
     */
    number: (input, range) => {

        const intTest = /^\d+$/.test(input);
        if (!intTest) return false; // if not int convertable. 

        if (range !== undefined) {
            const intInput = parseInt(input);
            return (intInput >= range[0] && intInput <= range[1]); // if inside range.
        }

        return true;
    },

    /**
     * Returns whether received string exists within object keywords.
     */
    onoff: (input) => {
        return ['on', 'off'].includes(input);
    }

}