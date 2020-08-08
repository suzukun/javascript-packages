const path = require('path');
const { map, concat, filter } = require('lodash');
const { readdir } = require('mz/fs');

interface IDirent {
    name: string;
    isDirectory: Function;
}

export const searchFiles = async (dir: string, extentions: RegExp) => {
    const dirents: Array<IDirent> = await readdir(dir, { withFileTypes: true });

    return Promise.all(
        map(dirents, (dirent: IDirent) =>
            dirent.isDirectory()
                ? searchFiles(path.join(dir, dirent.name), extentions)
                : Promise.resolve(path.join(dir, dirent.name))
        )
    )
        .then(result => concat([], ...result))
        .then(result => filter(result, (file: string) => extentions.test(file)));
};
