#!/usr/bin/env node
import { folderCLI, singleCLI } from "./thumbnailer";
const fs = require("fs-extra");
const { program } = require("commander");
const colors = require("colors");

let version = "1.0.3";

function titleScreen() {
  let b64 =
    "ICBfX19fXyBfICAgICAgICAgICAgICAgICAgICAgXyAgICAgICAgICAgICAgICAgXyBfICAgICAgICAgICBfICAgICAKIHxfICAgX3wgfF9fICBfICAgXyBfIF9fIF9fXyB8IHxfXyAgXyBfXyAgIF9fIF8oXykgfCBfX18gXyBfXyhfKV9fXyAKICAgfCB8IHwgJ18gXHwgfCB8IHwgJ18gYCBfIFx8ICdfIFx8ICdfIFwgLyBfYCB8IHwgfC8gXyBcICdfX3wgLyBfX3wKICAgfCB8IHwgfCB8IHwgfF98IHwgfCB8IHwgfCB8IHxfKSB8IHwgfCB8IChffCB8IHwgfCAgX18vIHxfIHwgXF9fIFwKICAgfF98IHxffCB8X3xcX18sX3xffCB8X3wgfF98Xy5fXy98X3wgfF98XF9fLF98X3xffFxfX198XyhfKS8gfF9fXy8KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8X18vICAgICA=";

  console.log(colors.red(Buffer.from(b64, "base64").toString("ascii")));
  console.log(`\t\t\t\t\t\t\tv${version}`);
  console.log(
    "\n A " +
      colors.red("NPM module") +
      " and CLI tool to create thumbnails in " +
      colors.green("NodeJS") +
      " \n\n"
  );
}

program
  .name("Thumbnailer.js")
  .version(version)
  .description("A simple tool to generate thumbnails for images.")
  .option("--width <number>", "width of the output image. Defaults to 200px.")
  .option("--height <number>", "height of the output image. Defaults to 200px.")

  .option(
    "-q, --quality  <number>",
    "quality of the output image. Defaults to 80. Range: 0-100"
  )
  .option("--fit <fit>", "resize mode of the output image. Defaults to cover.")
  .option(
    "-p, --position <position>",
    "position of the output image. Defaults to center."
  )
  .option("-i, --input  <file>", "output image path and filename.")
  .option(
    "-o, --output <output>",
    "output image folder. Defaults to the same as the input image."
  )
  .option(
    "-f, --format <format>",
    "format of the output image. Defaults to the same as the input image."
  )
  .option(
    "-pre, --prefix <format>",
    "Prefix for new file name. Defaults to widthxheight to prevent overwriting."
  )
  .addHelpText(
    "beforeAll",

    titleScreen()
  )
  .addHelpText(
    "after",
    `

Example call:
	${colors.red("thumbjs")} --width ${colors.cyan(640)} --height ${colors.cyan(
      "480"
    )} -f ${colors.cyan("png")} -q ${colors.cyan("60")}  -i ${colors.yellow(
      ".\\MyImages"
    )}   -o ${colors.yellow("..\\MyOutputFolder")} --prefix ${colors.yellow(
      "myPrefix"
    )}  --fit ${colors.yellow("cover")} -p ${colors.yellow("centre")}`
  )
  .parse(process.argv);

const options = program.opts();

if (options.input) {
  fs.stat(options.input).then((stat) => {
    if (stat.isDirectory()) {
      folderCLI(options);
    } else {
      singleCLI(options);
    }
  });
}
