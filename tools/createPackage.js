const { resolve, join } = require("path");
const { mkdir, writeFile } = require("mz/fs");
const { Command } = require("commander");
const chalk = require("chalk");
const { getESLintIgnore } = require("../assets/getESLintIgnore");
const { getESLintRC } = require("../assets/getESLintRC");
const { getIndexCode } = require("../assets/getIndexCode");
const { getJestConfig } = require("../assets/getJestConfig");
const { getNPMIgnore } = require("../assets/getNPMIgnore");
const { getNPMRC } = require("../assets/getNPMRC");
const { getPackage } = require("../assets/getPackage");
const { getReadMe } = require("../assets/getReadMe");
const { getSampleCode } = require("../assets/getSampleCode");
const { getSampleTestCode } = require("../assets/getSampleTestCode");
const { getTSConfig } = require("../assets/getTSConfig");
const { getTypeDoc } = require("../assets/getTypeDoc");
const { getWebpackConfig } = require("../assets/getWebpackConfig");

const PACKAGES_DIR = resolve("./packages/");

const GENERATE_MAP = {
    "./.eslintignore": getESLintIgnore,
    "./.eslintrc.js": getESLintRC,
    "./index.ts": getIndexCode,
    "./jest.config.js": getJestConfig,
    "./.npmignore": getNPMIgnore,
    "./.npmrc": getNPMRC,
    "./package.json": getPackage,
    "./README.md": getReadMe,
    "./src/libs/sample.ts": getSampleCode,
    "./__tests__/sample.test.ts": getSampleTestCode,
    "./tsconfig.json": getTSConfig,
    "./typedoc.js": getTypeDoc,
    "./webpack.config.js": getWebpackConfig,
};

(async () => {
    const param = new Command()
        .option("-t, --target <name>", "package name", null)
        .parse(process.argv);

    if (!param.target) {
        throw new Error("名前をつけてください。");
    }

    const promises = Object.keys(GENERATE_MAP).map(async (dir) => {
        const getText = GENERATE_MAP[dir];
        const text = getText(param.target);
        const generateFilePath = join(PACKAGES_DIR, param.target, dir);
        const generateDir = (() => {
            const splitedDir = generateFilePath.split('/');
            splitedDir.pop();
            return splitedDir.join('/');
        })();

        await mkdir(generateDir, { recursive: true });
        await writeFile(generateFilePath, text);
    });

    await Promise.all(promises);

    console.log(
        ["package ", chalk.green.bold(param.target), " を生成しました。"].join(
            ""
        )
    );
})();
