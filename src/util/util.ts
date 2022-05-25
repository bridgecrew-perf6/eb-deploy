import fs from "fs";
import Jimp = require("jimp");

const Axios = require("axios");

// Download Image
// Because some reason, image from this url "https://upload.wikimedia.org/wikipedia/commons/b/bd/Golden_tabby_and_white_kitten_n01.jpg" 
// Cannot download directly by using Jimp
async function downloadImage(url: string): Promise<string> {
  const filepath:string = String(Math.floor(Math.random() * 2000));
  const response = await Axios({
    url,
    method: "GET",
    responseType: "stream",
  });
  return new Promise((resolve, reject) => {
    response.data
      .pipe(fs.createWriteStream(__dirname + "/tmp/de" + filepath + ".jpg"))
      .on("error", reject)
      .once("close", () => resolve(__dirname + "/tmp/de" + filepath + ".jpg"));
  });
}

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const localPath = await downloadImage(inputURL);
      const photo = await Jimp.read(localPath);
      await deleteLocalFiles([localPath]);
      const outpath =
        "/tmp/filtered." + Math.floor(Math.random() * 2000) + ".jpg";
      await photo
        .resize(256, 256) // resize
        .quality(60) // set JPEG quality
        .greyscale() // set greyscale
        .write(__dirname + outpath, (img) => {
          resolve(__dirname + outpath);
        });
    } catch (error) {
      reject(error);
    }
  });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files: Array<string>) {
  for (let file of files) {
    fs.unlinkSync(file);
  }
}
