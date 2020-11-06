module.exports.toCamelCase = (text, isWithUpper = false) => {
    if (!text) return "";

    const resultText = text.split(/[-_\s]+/).reduce((result, t, i) => {
        if (!isWithUpper && i === 0) {
            result += t.toLowerCase();
        } else {
            result += t
                .toLowerCase()
                .replace(/^[a-z]/, (value) => value.toUpperCase());
        }

        return result;
    }, "");

    return resultText;
};
