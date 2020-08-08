import { map, concat, keys } from 'lodash';
import { CONSTANTS } from '../../constants';
import { mixins } from '../../mixins';
import { indent } from '../../utils/indent';

interface IData {
    [key: string]: {
        width: number;
        height: number;
    };
}

export const sass = (path: string, datas: Array<IData>) => {
    const firstFormat = map(datas, obj => {
        const key = keys(obj)[0];
        const data = obj[key];
        const header = `${indent(1)}${key}: (`;
        const footer = `${indent(1)}),`;
        const width = `${indent(2)}width: ${data.width}px,`;
        const height = `${indent(2)}height: ${data.height}px,`;

        return [header, width, height, footer].join('\n');
    });
    const secondFormat = [
        `${CONSTANTS.VARIABLE_IMAGE_DIR}: '${path}';`,
        concat([], [`${CONSTANTS.VARIABLE_IMAGE_MAP}: (`], firstFormat, [');']).join('\n'),
        mixins.sass,
    ].join('\n\n');

    return secondFormat;
};
