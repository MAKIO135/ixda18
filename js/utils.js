// Based on Fisher–Yates shuffle ( https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle )
// and Shuffling an Array in JavaScript ( https://www.kirupa.com/html5/shuffling_array_js.htm )

// returns a new array shuffled
Array.prototype.shuffle = function() {
    let tmpArray = [ ... this ]; // create a copy of original array
    for( let i = tmpArray.length - 1; i; i -- ) {
        let randomIndex = ~~( Math.random() * ( i + 1 ) );
        [ tmpArray[ i ], tmpArray[ randomIndex ] ] = [ tmpArray[ randomIndex ], tmpArray[ i ] ]; // swap
    }
    return tmpArray;
};

// permanently shuffles the array
Array.prototype.permShuffle = function() {
    for( let i = this.length - 1; i; i -- ) {
        let randomIndex = ~~( Math.random() * ( i + 1 ) );
        [ this[ i ], this[ randomIndex ] ] = [ this[ randomIndex ], this[ i ] ]; // swap
    }
    return this;
};

const flatten = function(arr, result = []) {
    for (let i = 0, length = arr.length; i < length; i++) {
        const value = arr[i];
        if (Array.isArray(value)) {
            flatten(value, result);
        } else {
            result.push(value);
        }
    }
    return result;
};
