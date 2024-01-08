const express = require("express");
const app = express();
const fetchWeatherData = require("./weatherApi");
const PORT = process.env.PORT || 3000;
const db = require("./config/database");
const telegramBot = require("node-telegram-bot-api");
const Subscription = require("./models/subscription");

db();
app.use(express.json());

const TOKEN = ;
const bot = new telegramBot(TOKEN, { polling: true });

async function forecastHandler(chat_id) {
  await bot.sendMessage(chat_id, "Please select a city.");

  bot.once("message", async (message) => {
    const selectedCity = message.text.trim().toLowerCase();

    const response = await fetchWeatherData(selectedCity);

    if (response) {
      const reply = {
        location: response.location.name,
        temp_c: response.current.temp_c,
        temp_f: response.current.temp_f,
        humidity: response.current.humidity,
      };

      const formattedReply = JSON.stringify(reply, null, 2);

      await bot.sendMessage(chat_id, formattedReply);
    } else {
      await bot.sendMessage(
        chat_id,
        "Unable to fetch weather data. Please try again later."
      );
    }
  });
}

async function check(chat_id) {
  const firstText =
    "Hi there! Before you start using the bot, you need to enter the following details: name, age";
  const secText =
    "You can use /forecast command to check weather in your desired city";
  const res = await Subscription.findOne({ chatId: chat_id });

  if (!res) {
    let name;
    let age;

    await bot.sendMessage(chat_id, firstText);
    await bot.sendMessage(chat_id, secText);

    const getName = new Promise((resolve) => {
      bot.once("message", async (message) => {
        name = message.text.trim().toLowerCase();
        resolve();
      });
    });
    await bot.sendMessage(chat_id, "Name?");
    await getName;

    const getAge = new Promise((resolve) => {
      bot.once("message", async (message) => {
        age = message.text.trim().toLowerCase();
        resolve();
      });
    });

    await bot.sendMessage(chat_id, "Age?");
    await getAge;

    try {
      // Create a new subscription document in the database
      await Subscription.create({
        chatId: chat_id,
        name: name,
        age: age,
      });

      // Now you can use the captured name and age for further processing
      await bot.sendMessage(
        chat_id,
        "Thanks for providing your details. You are now registered!"
      );
    } catch (error) {
      console.error("Error inserting data:", error.message);
      await bot.sendMessage(chat_id, "Error occurred. Please try again later.");
    }
  } else {
    // User already exists
    return true;
  }
}

bot.on("message", (message) => {
  const chat_id = message.from.id;
  const text = message.text;

  if (text.charAt(0) === "/") {
    const command = text.substr(1);
    switch (command) {
      case "start":
        bot.sendMessage(chat_id, "hello");
        check(chat_id);
        break;
      case "forecast":
        forecastHandler(chat_id);
        break;
      // case default:
      // bot.sendMessage();
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
