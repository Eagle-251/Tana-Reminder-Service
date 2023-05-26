const express = require("express");
const schedule = require("node-schedule");
const cors = require('cors')
const axios = require("axios");

const port = 3000;
const app = express();

const corsConfig = {
  origin: 'https://app.tana.inc',
  optionsSuccessStatus: 200
}


app.get("/", cors(corsConfig), async (req, res) => {
  const date = req.query.date;
  const postData = {
    topic: req.query.topic,
    title: "Tana reminder",
    actions: [{ action: "view", label: "Open in Tana", url: req.query.link }],
    message: req.query.message,
    icon: "https://app.tana.inc/apple-touch-icon.png",
  };
  const tanaResponse = "Reminder Set:: [x]";
  const parseDelay = () => {
    const regex = /\[\[date:\s*([\dT:-]+)\]\]/;
    const match = date.match(regex);
    return match[1];
  };
  console.log("Setting a reminder for", postData.message, "at", parseDelay());
  const reminder = schedule.scheduleJob(parseDelay(), async () => {
    try {
      console.log("Sending reminder for", postData.message);
      const resp = await axios.post("https://ntfy.sh", postData);
      console.log(resp.data);
    } catch (err) {
      console.error(err);
    }
  });
  return res.send(tanaResponse);
});

app.listen(port);
console.log("Listening on", port);
