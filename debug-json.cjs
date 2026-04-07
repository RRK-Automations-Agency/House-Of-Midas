const fs = require('fs');

async function debug() {
  try {
    const response = await fetch("https://injcqx-q1.myshopify.com/collections/all/products.json?limit=5");
    const data = await response.json();
    console.log(JSON.stringify(data.products[0], null, 2));
  } catch (e) {
    console.error(e);
  }
}

debug();
