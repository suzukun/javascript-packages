import { sass } from './sass';

interface IFormatter {
    sass: Function;
}

export const formatter: IFormatter = {
    sass,
};
