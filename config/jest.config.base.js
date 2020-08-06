module.exports = {
    moduleFileExtensions: ["js", "ts", "json"],
    transform: {
        "^.+\\.js$": "babel-jest",
        "^.+\\.ts$": "ts-jest",
        "^.+\\.json$": "jest-transform-stub",
    },
    verbose: true,
    notify: true,
    collectCoverage: true,
    coverageReporters: ["none"],
};
