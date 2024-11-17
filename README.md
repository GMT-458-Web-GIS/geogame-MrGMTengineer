[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/ATV5e7Id)
*Click and start the game on the website** : https://gmt-458-web-gis.github.io/geogame-MrGMTengineer/
# Two Take Give Game

**Two Take Give Game** is an interactive geography game where players attempt to guess a randomly selected city on the map. The game features an animated start screen and provides hints to enhance the experience.

## Features

- 🌍 **Random Target City**: A random city from around the world is chosen for each round.
- 📸 **Hint Images**: Hints are provided using city-related images fetched from the Unsplash API.
- 🗺️ **Map Interaction**: Players can interact with the map, placing markers to make their guesses.
- 🖐️ **Hand Animations**: Fun hand animations appear at the beginning of the game.
- 🔄 **Multiple Attempts**: Players are given three attempts per round to guess the target city.

## How to Play

1. Click the **"Start Game"** button.
2. Watch the hand animation and wait for the map to appear.
3. Use the hints provided to guess the target city.
4. Click on the map to place a marker for your guess.
5. The distance from your guess to the target city will be displayed, along with the remaining attempts.

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Map Framework**: [Leaflet.js](https://leafletjs.com/)
- **APIs**:
  - [Unsplash API](https://unsplash.com/developers): For fetching city-related images.
  - [OpenCage Geocoder API](https://opencagedata.com/): For geocoding random latitude and longitude to city names.

## Setup and Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/two-take-give-game.git
   cd two-take-give-game
