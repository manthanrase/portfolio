const apiKey = "6472ab8bdc9b8cb8ee2e5e09bada3e4d";
      const apiUrl =
        "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
      const searchBox = document.querySelector(".search input");
      const searchBtn = document.querySelector(".search button");
      const weatherIcon = document.querySelector(".weather-icon");

      

      async function checkWeather(city) {
        const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

        if (response.status==404){
            document.querySelector(".error").style.display = "block";
            document.querySelector(".weather").style.display = "none";
        } else{
            var data = await response.json();

        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".temp").innerHTML =
          Math.round(data.main.temp) + "°C";
        document.querySelector(".humidity").innerHTML =
          data.main.humidity + " %";
        document.querySelector(".wind").innerHTML = data.wind.speed + " Km/h";

        const weatherType = data.weather[0].main;
        console.log(data);

        if (weatherType === "Clouds") {
          weatherIcon.src = "img/clouds.png";

        } else if (weatherType === "Clear") {
          weatherIcon.src = "img/clear.png";

        } else if (weatherType === "Rain") {
          weatherIcon.src = "img/rain.png";

        } else if (weatherType === "Drizzle") {
          weatherIcon.src = "img/drizzle.png";

        } else if (weatherType === "Mist") {
          weatherIcon.src = "img/mist.png";
        }

        document.querySelector(".card").classList.add("expand");
        document.querySelector(".weather").classList.add("show");
        document.querySelector(".error").style.display = "none";

         }
        }

      searchBtn.addEventListener("click", () => {
        checkWeather(searchBox.value);
      });

       searchBox.addEventListener("keydown", (e) => {
        if(e.key === "Enter"){
            checkWeather(searchBox.value);
        }
      });
     

     