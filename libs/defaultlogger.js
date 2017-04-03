let dump = (level, obj) => {
    console.log(level);
    console.dir(obj, {
        colors: true,
        depth: null
    });
};

let f;
module.exports = {
    fatal: (obj) => dump('FATAL', obj),
    error: (obj) => dump('ERROR', obj),
    debug: (obj) => (f = dump('DEBUG', obj)),
    info: (obj) => dump('INFO', obj),
    log: (obj) => f
};