const express = require("express");
require("dotenv").config();
const fileUpload = require("express-fileupload");
const pdfParse = require("pdf-parse");
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPEN_API_KEY,
});
const openai = new OpenAIApi(configuration);

const app = express();

app.use(fileUpload());

app.post("/extract-text", async (req, res) => {
  if (!req.files && !req.files.pdfFile) {
    res.status(400);
    res.end();
  }

  pdfParse(req.files.pdfFile).then((result) => {
    openai
      .createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "user", content: `Explain me this text ${result.text}` },
        ],
      })
      .then((completion) => {
        res.send(completion.data.choices[0].message);
      });

    console.log();
  });
});

app.listen(3003, () => {
  console.log("RUNNING ON");
});
