import fs = require("fs-extra");
import sharp = require("sharp");
const path = require("path");
const colors = require("colors");
const ProgressBar = require("progress");
export const folderCLI = ({
  input,
  width,
  height,
  quality,
  position,
  fit,
  prefix,
  format,
  output,
}) => {
  let folderPath = input;
  let images: any = fs.readdirSync(folderPath);
  let thumbJSPRefix = width && height ? `${width}x${height}-` : "";

  //filter the images
  images = images
    .filter((image) => {
      return [".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(
        path.extname(image).toLowerCase()
      );
    })
    .map((image) => {
      return {
        fileName: image.split(".")[0],
        extension: image.split(".")[1],
        filePath: path.join(folderPath, image),
      };
    });

  console.log(`📁 Input: ${colors.cyan(folderPath)}`);
  console.log(`📁 Output: ${colors.yellow(output || folderPath)}`);

  console.log("📷 Images count: " + images.length);
  console.log("\n	");
  width && console.log(`📐 Width: ${width}px`);
  height && console.log(`📐 Height: ${height}px`);
  console.log(`🪄  Quality ${quality || 80}%`);
  console.log("\n\n");
  var bar = new ProgressBar(
    `Processing${colors.cyan(" [:bar] ")}:current/:total :percent`,
    {
      total: images.length,
      complete: "❚",
      incomplete: " ",
    }
  );

  images.forEach(({ fileName, filePath }) => {
    return single(path.join(filePath), {
      width: width ? parseInt(width) : undefined,
      height: height ? parseInt(height) : undefined,
      quality: quality ? parseInt(quality) : undefined,
      fit: fit,
      position: position,
      format: format,
    }).then((buffer) => {
      let path_ = path.resolve(
        `${output || folderPath}/${prefix || thumbJSPRefix}${fileName}.${
          format || format
        }`
      );
      fs.outputFile(path_, buffer, (err) => {
        bar.tick();

        if (bar.complete) {
          console.log(colors.green("\nDone! 👍"));

          console.log(
            colors.yellow(
              `Images were saved to: ${colors.cyan(
                ".\\" + (output || folderPath)
              )}`
            )
          );
        }
      });
    });
  });
};

export const singleCLI = ({
  input,
  width,
  height,
  quality,
  position,
  fit,
  prefix,
  format,
  output,
}) => {
  let folderPath = path.dirname(input);

  console.log(`📁 Input: ${colors.cyan(input)}`);
  console.log(`📁 Output: ${colors.yellow(output || folderPath)}`);

  console.log("\n	");
  width && console.log(`📐 Width: ${width}px`);
  height && console.log(`📐 Height: ${height}px`);
  console.log(`🪄  Quality ${quality || 80}%`);
  console.log("\n\n");
  var bar = new ProgressBar(
    `Processing${colors.cyan(" [:bar] ")}:current/:total :percent`,
    {
      total: 1,
      complete: "❚",
      incomplete: " ",
    }
  );

  single(input, {
    width: width ? parseInt(width) : undefined,
    height: height ? parseInt(height) : undefined,
    quality: quality ? parseInt(quality) : undefined,
    fit: fit,
    format: format,
    position: position,
  }).then((buffer) => {
    fs.outputFile(`${output || "."}/${prefix || ""}${input}`, buffer, (err) => {
      bar.tick();

      if (bar.complete) {
        console.log(colors.green("\nDone! 👍"));

        console.log(
          colors.yellow(
            `Image was saved to: ${colors.cyan(".\\" + (output || folderPath))}`
          )
        );
      }
    });
  });
};

const folder = (folder, sizes, options) => {
  const files = fs.readdirSync(path.join(folder));
  const filesWithFullPath = files
    .map((file) => {
      if (fs.lstatSync(`${folder}/${file}`).isFile()) {
        return file;
      }
    })
    .filter((file) => file);
  filesWithFullPath.forEach((image) => {
    sizes.forEach((size) => {
      single(`${folder}/${image}`, size).then((sharp) => {
        if (options.newFolder) fs.ensureDirSync(options.newFolder);

        let originalFileName = image.split(".")[0];
        let originalFileExtension = image.split(".")[1];

        let myPrefix = `${size.width}x${size.height}-`;

        let newName = size.prefix
          ? `${size.prefix}${originalFileName}.${
              size.format || originalFileExtension
            }`
          : `${myPrefix}${originalFileName}.${
              size.format || originalFileExtension
            }`;

        let filePath = options.newFolder
          ? `${options.newFolder}/${newName}`
          : `${folder}/${newName}`;

        fs.outputFileSync(filePath, sharp);
      });
    });
  });
};

const single = async (
  filePath,
  {
    width,
    height,
    fit = "cover",
    format = "jpeg",
    quality = 80,
    position = "center",
  }: {
    width?: number;
    height?: number;
    fit?: string;
    format?: string;
    quality?: number;
    position?: string;
  }
) => {
  try {
    let sharp_ = await sharp(filePath).resize(width, height, {
      fit: fit || "cover",
      position: position || "center",
    });

    switch (format) {
      case "jpeg":
        sharp_ = sharp_.jpeg({ quality: quality });
      case "jpg":
        sharp_ = sharp_.jpeg({ quality: quality });
      case "png":
        sharp_ = sharp_.png({
          quality: quality,
        });
      case "webp":
        sharp_ = sharp_.webp({
          quality: quality,
        });
    }
    return sharp_.toBuffer();
  } catch (error) {
    throw new Error(error);
  }
};

const thumbjs = {
  folder,
  single,
};

export default thumbjs;
