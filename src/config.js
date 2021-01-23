/**
 * Configurations of Devices.
 * Returns an JSON wrapper of all devices.
 */



export function initDevicesObj() {

    // Device general on/off status object.
    var status = { 
        value: 'off',
        type: typeof 'off',
        keywords: ['on', 'off'],
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
    var microwave_keys = { 
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
    }
}