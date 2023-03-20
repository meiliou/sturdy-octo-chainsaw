# Weather App
## Description
This simple weather app connects to the OpenWeather API.  A user is able to search for any city in the world and the app will display the current weather and 5 day forecast for that city.  I have displayed the country as well since there are often multiple cities with the same name - we don't want the user to be dressed for Newcastle, ZA when they are in Newcastle, UK do we! If the user types the country code following the city, the correct city will be displayed. I've tried to allow for both possibilities to make it more user-friendly as more often than not, the city name is sufficient.
### Technology
I've used HTML, Javascript and bootstrap (and a tiny bit of JQuery to build this app. This app also connects to the OpenWeather api. 
### Website
https://meiliou.github.io/sturdy-octo-chainsaw/
### Screenshots
<img width="940" alt="image" src="https://user-images.githubusercontent.com/83768277/226268269-50bce138-2ad8-4070-889d-df3a385a03b8.png">

### Personal notes
I struggled to get the bootstrap working such that the left search container does not get overlapped by the display area. Also there is a lot of white space on the right hand side causing the forecast columns to be overly thin if I wanted to fit 5 cards next to each other. Quite frustrating, but we win some and we lose some. I will return one day to make it look prettier! <br> <br>
The free version of OpenWeather api provided forecasts in 3hour intervals so that was an additional step that I had to add (I looped every 8 list, but only after finding the first 12pm forecast - a forecast for the middle of the night seemed pointless...) <br> <br>
Learnt the importance of https vs http as http will work on your local environment but not live. Learnt about importance of %20 as a representation of "space". Learnt I need to practice JQuery more!
###
