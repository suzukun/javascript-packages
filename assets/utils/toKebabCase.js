module.exports.toKebabCase = (text) => {
    if (!text) return "";

    text = text.replace(/^\s*?[A-Z]/, (str) => str.toLowerCase());
    text = text.replace(/_/g, "-");
    text = text.replace(
        /\s*?[A-Z]/g,
        (str) => "-" + str.replace(/\s/g, "").toLowerCase()
    );

    return text;
};
