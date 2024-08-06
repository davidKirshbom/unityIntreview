const fileModel = require("../DB/models/File");
const http = require("http"); // or 'https' for https:// URLs
const https = require("https");
const fs = require("fs");
const path = require("path");
const { error } = require("console");
const { getFileNameFromUrl } = require("./urlUtils");
async function getDbFile(id, name) {
  const where = {};
  if (id) where = { id };
  if (name) where = { ...where, id };

  const file = await fileModel.findOne({
    where,
  });

  return file;
}
async function getDbUrlCount(url) {
  const file = await fileModel.count({
    where: {
      url,
    },
  });

  return file;
}

async function downloadFile(url, existingCounter) {
  const fileName =
    getFileNameFromUrl(url) +
    (existingCounter && existingCounter > 0 ? `_` + existingCounter : "");
  const downloadPath = path.join(require.main.path, "files", fileName);

  if (url.includes("https")) await handleHttpsDownload(url, downloadPath);
  else await handleHttpDownload(url, downloadPath);
  return downloadPath;
}

function handleHttpsDownload(url, path) {
  return new Promise((resolve, reject) => {
    try {
      const stream = fs.createWriteStream(path);

      const req = https.request(url, { timeout: 20 }, (res) => {
        res.pipe(stream);
        res.on("close", function () {
          resolve(path);
        });
        res;
        res
          .on("finish", () => {
            console.log("er");
          })
          .on("pipe", (v) => {
            console.log(v);
          })
          .on("error", (e) => {
            console.log(e);
          });
      });
    } catch (err) {
      console.log(err);
    }
  });
}

async function handleHttpDownload(url, path) {
  return await new Promise((resolve, reject) => {
    http.request(url, (res) => {
      res
        .pipe(fs.createWriteStream(path))
        .on("close", function () {
          resolve(path);
        })
        .on("error", (error) => reject(error));
    });
  });
}

module.exports = {
  downloadFile,
  getDbFile,
  getDbUrlCount,
};
