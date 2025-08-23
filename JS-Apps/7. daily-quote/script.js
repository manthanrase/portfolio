const quote = document.getElementById("quote");
const author = document.getElementById("author");
const api_url = "https://quotes-api-self.vercel.app/quote";

async function getquote(url) {
  const response = await fetch(url); //fetch here
  var data = await response.json(); // store data
  quote.innerHTML = data.quote;
  author.innerHTML = data.author;
}

getquote(api_url);

function tweet() {
  // to open new window
  window.open(
    "https://twitter.com/intent/tweet?text=" +
      quote.innerHTML +
      " %0A- by " +
      author.innerHTML,
    "Tweet Window",
    "width = 600, height = 300"
  );
}
