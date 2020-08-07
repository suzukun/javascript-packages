const { resolve, join } = require("path");
const { Command } = require("commander");
const { copy } = require("fs-extra");
const chalk = require("chalk");
const Rehack = require("rehack");

const PACKAGES_DIR = resolve("./packages/");
const SAMPLE_NAME = "sample";
const SAMPLE_DIR = join(PACKAGES_DIR, SAMPLE_NAME);

(async () => {
    const param = new Command()
        .option("-t, --target <name>", "package name", null)
        .parse(process.argv);

    if (!param.target) {
        throw new Error("名前をつけてください。");
    }

    const targetDir = join(PACKAGES_DIR, param.target);

    await copy(SAMPLE_DIR, targetDir);

    new Rehack(SAMPLE_NAME, param.target, { cwd: targetDir }).startWalking();

    console.log(["package ", chalk.green.bold(param.target), " を生成しました。"].join(""));
})();
