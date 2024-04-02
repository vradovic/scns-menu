require('dotenv').config();
const crawler = require('crawler-request');
const { uploadMenus } = require('./db');

crawler(process.env.PDF_URL).then(async (pdf) => {
  console.log('PDF loaded...');
  console.log(pdf)
  const tokens = pdf.text.split('\n');

  const menus = [];
  const meals = ['breakfast', 'lunch', 'dinner'];
  let mealIndex = 0;
  let menu;
  let skipFirstDate = true;
  let chainFoods = false;
  const regex = /\b(\d{2})\.(\d{2})\.(\d{4})\b/;

  tokens.forEach((token) => {
    const match = regex.exec(token);

    if (match) {
      if (skipFirstDate) {
        skipFirstDate = false;
        return;
      }
      if (menu) {
        menus.push(menu);
      }

      const day = parseInt(match[1], 10);
      const month = parseInt(match[2], 10) - 1; // Month in JavaScript Date object is zero-based
      const year = parseInt(match[3], 10);

      const date = new Date(Date.UTC(year, month, day));
      menu = {
        date,
        breakfast: [],
        lunch: [],
        dinner: [],
      };
      mealIndex = 0;
    } else if (token.match(/^\d|-/) && menu) {
      menu[meals[mealIndex]].push(token);
      chainFoods = true;
      if (token.includes('Хлеб')) {
        chainFoods = false;

        if (mealIndex < 2) {
          mealIndex++;
        }
      }
    } else if (chainFoods && menu) {
      menu[meals[mealIndex]].push(token);
    }
  });

  console.log('Parsed, uploading menus...');
  await uploadMenus(menus);
});