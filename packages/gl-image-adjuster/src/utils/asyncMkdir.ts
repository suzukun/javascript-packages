import { mkdir } from 'fs';

export const asyncMkdir = (p: string) =>
    new Promise<void>((resolve, reject) => {
        mkdir(p, { recursive: true }, e => {
            if (e) {
                reject(e);
            } else {
                resolve();
            }
        });
    });
