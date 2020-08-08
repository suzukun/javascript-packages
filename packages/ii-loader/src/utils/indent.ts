import { map } from 'lodash';
import { CONSTANTS } from '../constants';

export const indent = (len: number = 1) => map(new Array(len), () => CONSTANTS.INDENT).join('');
