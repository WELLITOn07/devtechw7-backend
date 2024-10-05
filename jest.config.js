module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'js', 'json'],
    rootDir: '.',
    moduleNameMapper: {
        "^src/(.*)$": "<rootDir>/src/$1"
    },
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    testRegex: '.*\\.spec\\.ts$',
};
