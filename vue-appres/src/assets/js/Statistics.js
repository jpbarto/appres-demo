export function sumArr(arr) {
    var a = arr.slice();
    return a.reduce(function (a, b) { return parseFloat(a) + parseFloat(b); });
}

export function sortArr(arr) {
    var ary = arr.slice();
    ary.sort(function (a, b) { return parseFloat(a) - parseFloat(b); });
    return ary;
}

export function calcAverage(arr) {
    var a = arr.slice();
    if (a.length) {
        const sum = sumArr(a);
        const avg = sum / a.length;
        return avg;
    }
    return false;
}

export function calcQuartile(arr, q) {
    var a = arr.slice();
    // Turn q into a decimal (e.g. 95 becomes 0.95)
    q = q / 100;

    // Sort the array into ascending order
    var data = sortArr(a);

    // Work out the position in the array of the percentile point
    var p = ((data.length) - 1) * q;
    var b = Math.floor(p);

    // Work out what we rounded off (if anything)
    var remainder = p - b;

    // See whether that data exists directly
    var retval = 0;
    if (data[b + 1] !== undefined) {
        retval = parseFloat(data[b]) + remainder * (parseFloat(data[b + 1]) - parseFloat(data[b]));
    } else {
        retval = parseFloat(data[b]);
    }
    if (isNaN(retval)) {
        return 0;
    }else{
        return retval;
    }
}