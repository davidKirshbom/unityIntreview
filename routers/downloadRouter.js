const express = require("express");
const os = require("os");
const path = require("path");
const { getDbFile, getDbUrlCount } = require("../utils/fileUtils");
const File = require("../DB/models/File");
const { getFileNameFromUrl } = require("../utils/urlUtils");

const downloadRouter = express.Router();

downloadRouter.get("/file", async (req, res) => {
  const { id, name } = req.query;
  let file;
  try {
    file = await getDbFile(id, name);
  } catch (err) {
    res.status(500).send({ code: 500, message: e?.message });
  }
  res.send(file);
  return;
});

downloadRouter.post("/create", async (req, res) => {
  const { url } = req.query;
  const { binary } = req.body;
  if (!url || url === "")
    return res.status(400).send({ code: 400, message: "no url provided" });
  const downloadedTimes = await getDbUrlCount(url);
  let fileName = await getFileNameFromUrl(url);
  if (downloadedTimes > 0) {
    fileName + "".replace(".", `_${downloadedTimes}.`);
  }
  const file = await File.create({
    url,
    name: fileName,
    url,
    binary: binary,
  });
  return res.send({
    file,
    warnings:
      downloadedTimes > 0 ? `file exist have set the name:${fileName}` : null,
  });
});

downloadRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await File.destroy({ where: { id } });
  return res.send();
});

downloadRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { url, name, path } = req.body;
  const updateObj = {};
  if (url) updateObj.url = url;
  if (name) updateObj.name = name;
  if (path) updateObj.path = path;
  const file = await File.update(updateObj, {
    where: { id },
  });
});
module.exports = downloadRouter;
