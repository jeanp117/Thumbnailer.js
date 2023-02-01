
![A simple Node.js module and CLI tool for generating image thumbnails.](https://user-images.githubusercontent.com/10646025/215982494-949aa2b2-b057-4f86-98ed-8bde58fbce48.png)

# Thumbnailer.js

A simple Node.js module and CLI tool for generating image thumbnails.

## Features

-   API and  CLI modes 
-   Flexible options for resizing and positioning the image
-   Supports multiple image formats
-   **Supports batch processing of images in a folder**

## Installation


`npm install thumbnailerjs -g`


## Usage

### As a module
```javascript
    import thumbnailer from "thumbnailerjs";
    
    // Create a single thumbnail
    thumbnailer.single("test.jpg", {
        width: 100,
        height: 100,
        fit: "cover",
        format: "jpeg",
        quality: 80,
        position: "center",
    }).then((buffer) => {
        fs.outputFileSync("test.jpg", buffer); // requires fs-extra
    });
    
    // Create thumbnails for all images in a folder
    thumbnailer.folder(
      "./TEST/",
      [
        {
          width: 200,
          height: 200,
          fit: "cover",
          quality: 80,
          format: "webp",
          position: "center",
        },
        {
          width: 400,
          height: 400,
          fit: "cover",
          position: "center",
        }
      ],
      {
        newFolder: "TEST-NEW",
      }
    );`
```
### On demand (Using Express)



You can use Express or any other library 
In this example you can request any image from uploads/images and convert and resize it, then you will have the resulting image as a buffer which you can send on the response 

```javascript
    app.route("/:image").get((req, res) => {
        const image = req.params.image;
      const {
        width,
        height,
        format,
      }: {
        width?: string;
        height?: string;
        format?: string;
      } = req.query;
      let filename = image.split("/").pop();
      let extension = filename.split(".").pop();
      thumbnailer.single(`uploads/images/${image}`, {
        width: parseInt(width),
        height: height ? parseInt(height) : undefined,
        fit: "cover",
        format: format,
      })
        .then((sharp) => {
          res.set("Content-Type", `image/${format || extension}`);
          res.end(sharp);
        })
        .catch((err) => {
          console.log("error" + err);
          res.send(err.message);
        });
    });
```
The URL  will look like this
http://localhost:3000/testImage.png?width=320&format=webp

### As a CLI tool
| Option | Alias | Description | Default |
| ------ | ----- | ----------- | ------- |
| --version | -V | Output the version number |  |
| --width |  | Width of the output image | 200px |
| --height |  | Height of the output image | 200px |
| --quality | -q | Quality of the output image | 80 |
| --fit |  | Resize mode of the output image | cover |
| --position | -p | Position of the output image | center |
| --input | -i | Output image path and filename |  |
| --output | -o | Output image folder | same as input image |
| --format | -f | Format of the output image | same as input image |
| --prefix | -pre | Prefix for new file name | widthxheight |
| --help | -h | Display help for command |  |



## Example call

```bash
thumbnailer --width 640 --height 480 -f png -q 60  -i .\MyImages   -o ..\MyOutputFolder --prefix myPrefix  --fit cover -p center
```

## Fit explanation
![explanation](https://user-images.githubusercontent.com/10646025/215991092-5355a1b0-cd6f-43d9-832c-554af5243a97.png)

If you only define one of the two (width or height) the defined one will be taken and the other will be calculated proportionally





## Contribution
If you have suggestions for new features please post them on github

We welcome contributions and ideas to improve this project! If you have a suggestion or want to contribute, please open an issue or create a pull request in our GitHub repository. Your input and ideas are valuable to us and can help make this project even better. Thank you for your support!
