export const nearPow2 = (n: number) => {
    if (n <= 0) {
        return {
            greater: 0,
            lesser: 0,
            near: 0,
        };
    }

    const e = Math.log2(n);
    const greater = Math.floor(2.0 ** Math.ceil(e));
    const lesser = Math.floor(2.0 ** Math.ceil(e - 1));

    return {
        greater,
        lesser,
        near: greater - n > n - lesser ? lesser : greater,
    };
};
