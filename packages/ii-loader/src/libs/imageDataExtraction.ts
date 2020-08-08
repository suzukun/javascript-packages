import path from 'path';
import { promisify } from 'util';
import { imageSize } from 'image-size';
import { map } from 'lodash';
import { CONSTANTS } from '../constants';

const sizeOf = promisify(imageSize);
const getSize = (root: string, resolvePath: string, file: string) =>
    sizeOf(file).then(dimensions => {
        if (!dimensions) {
            return;
        }

        const noRootName = file.replace(`${root}/`, '');
        const name = path
            .join(resolvePath, noRootName)
            .replace(/\//g, CONSTANTS.SLASH)
            .replace(/\./g, CONSTANTS.PERIOD);

        return {
            [name]: {
                width: dimensions.width,
                height: dimensions.height,
            },
        };
    });
export const extract = (root: string, resolvePath: string, files: Array<string>) =>
    Promise.all(map(files, file => getSize(root, resolvePath, file)));
