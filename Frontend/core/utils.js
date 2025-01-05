function log() {
    // a custom log statements that indents
    // object for better readability
    for(let i = 0; i < arguments.length; i++) {
        var arg = arguments[i];
        // Stringigy and indent Object
        if (typeof arg == 'object') {
            arg = JSON.stringify(arg, null, 2);
        }
        console.log(arg);
    }
}

export default { log }; 
// export as a dictionary