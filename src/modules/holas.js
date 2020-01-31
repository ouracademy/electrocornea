const got = require("got");
const FormData = require("form-data");
const fs = require("fs");

const uploadFile = () => {
  const form = new FormData();

  form.append(
    "file",
    fs.createReadStream(
      "/home/artmadeit/Escritorio/reportes-demo/Benavides Gil_Paul_OD_18072018_193959.pdf"
    )
  );

  return got.post("http://127.0.0.1:8000/report", {
    body: form
  });
};

uploadFile().then(console.log);
