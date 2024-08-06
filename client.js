const axios = require("axios");
const { downloadFile } = require("./utils/fileUtils");
const https = require("https");
const run = async () => {
  const remoteUrl = "https://candidate.ironsrc.dev";
  const remoteResponse = await axios.get(remoteUrl);
  const urls = remoteResponse.data;
  for (const url of urls) {
    const binaryData = await getBinaryData(url);
    const response = await axios.post(
      "http://localhost:3000/create",
      { binary: binaryData },
      {
        params: {
          url,
        },
      }
    );
    console.log(response.data);
  }
};

const getBinaryData = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, function (res) {
      var data = [];
      res
        .on("data", function (chunk) {
          data.push(chunk);
        })
        .on("end", function () {
          var buffer = Buffer.concat(data);
          console.log(buffer.toString("base64"));
          resolve(data);
        });
    });
  });
};

run();
