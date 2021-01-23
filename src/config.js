/**
 * Configurations of Devices.
 * Returns an JSON wrapper of all devices.
 */
export function initDevicesObj() {

    // Device general on/off status object.
    const status = { 
        value: false,
        type: typeof true,
        keywords: ['on', 'off'],
        valid: (input) => ['on', 'off'].includes(input),
    };

    // TV Device Object.
    const tv_keys = { 
        status: status,
        ch: numberTypeKey(1, 1, 100),
    };

    // AC Device Object.
    const ac_keys = { 
        status: status,
        temp: numberTypeKey(20, 10, 30),
    };

    // PC Device Object.
    const pc_keys = { 
        status: status,
    };

    // Microwave Device Object.
    const microwave_keys = { 
        status: status,
        temp: numberTypeKey(20, 0, 30),
        time: numberTypeKey(30, 30, 300),
    };

    // Returns device object wrapper.
    return { 
        tv1: tv_keys,
        tv2: tv_keys,
        ac: ac_keys,
        pc: pc_keys,
        microwave: microwave_keys,
    };
}

/**
 * Refactors the creation of number-type device keys.
 * Such as: temp, channel, etc.
 */
function numberTypeKey(defaultValue, rangeMin, rangeMax) {
    return {
        value: defaultValue,
        type: typeof 1,
        range: {
            min: rangeMin,
            max: rangeMax,
        },
        valid: (input) => intValidation(input, rangeMin, rangeMax),
    }
}

/**
 * Returns whether received input is valid - 
 * Convertable to int and within object key range.
 */
function intValidation(input, rangeMin, rangeMax) {

    const intTest = /^\d+$/.test(input);
    if (!intTest) return false; // if not int convertable. 

    if (rangeMin !== undefined && rangeMax !== undefined) {
        const intInput = parseInt(input);
        return (intInput >= rangeMin && intInput <= rangeMax); // if inside range.
    }

    return true;
}