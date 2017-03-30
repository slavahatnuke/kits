const AsyncKit = require('./src/AsyncKit');

module.exports = (creators) => {
    return new AsyncKit(creators);
};