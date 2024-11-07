# Pokédex PWA

![PokeDex Logo](assets/logo.webp)

## Description
**Pokédex PWA** is a Progressive Web Application (PWA) that allows users to explore detailed information about different Pokémon. It works both online and offline, enabling access to Pokémon data even without an internet connection. The application is designed to be installable on mobile or desktop devices and includes an interactive map for locating Pokémon worldwide.

## App URL
```plaintext
    https://darioba87.github.io/pokedex/
```

## Key Features

- **Browse Pokémon**: Explore a list of Pokémon with detailed information about each, including evolutions, stats, and types.
- **Interactive Map**: View Pokémon locations around the world on an interactive map using Leaflet and a coordinate API, showing cities where Pokémon can be found.
- **Favorites Feature**: Save your favorite Pokémon in a custom list stored in the browser's `IndexedDB`, accessible even offline.
- **Offline Mode**: As a PWA, the app caches necessary resources and data from the API for offline use.
- **Installable on Devices**: The PWA structure enables installation on mobile and desktop devices, offering a native-like experience.

## Technologies Used

- **JavaScript (ES6+)** and modules for main functionality.
- **Service Worker**: Enables offline functionality and caching of resources.
- **IndexedDB**: Stores user’s favorite Pokémon data.
- **Manifest.json**: Defines PWA settings (icons, colors, home screen).
- **Leaflet.js**: Displays the interactive map with Pokémon locations.
- **Bulma CSS**: Provides a modern, responsive design.
- **GitHub Pages**: Hosts the application.

## Project Structure

```plaintext
.
├── index.html            # Main page of the application
├── location.html         # Page for the interactive map
├── single.html           # Detailed view for individual Pokémon
├── bookmarks.html        # Page for user's favorite Pokémon list
├── manifest.json         # Configuration for PWA settings
├── service-worker.js     # Service Worker for offline functionality
├── assets/               # Icons, backgrounds, and graphics
├── css/
│   ├── bulma.min.css     # CSS framework for styling
│   └── style.css         # Custom styles
├── data/
│   ├── pokemon_geojson_data.geojson         # Pokémon geographical data
│   └── pokemon_types_with_colors.json       # Pokémon type colors
└── js/
    ├── app.js            # Main application logic
    ├── modules/          # JavaScript modules
    │   ├── bookmarks.js
    │   ├── db.js
    │   ├── idb-src.js
    │   ├── lib.js
    │   ├── main.js
    │   ├── maps.js
    │   ├── menu.js
    │   └── single.js
```
## Installation and Usage

**Clone the Repository**
```plaintext
git clone https://github.com/your-username/your-repository.git
cd your-repository
```

**Run a Local Server (Optional for Development)**
Use the "Live Server" extension in VSCode or any local HTTP server to view the project locally.

**Open the Application**
Open index.html in your preferred browser, or visit the GitHub Pages link if deployed.

**Use on GitHub Pages**
If hosted on GitHub Pages, simply visit:

```plaintext
https://your-username.github.io/your-repository/
```
## PWA Features

1. **Offline Functionality:** The app uses a service-worker.js to cache resources and data for offline usage.
2. **Device Installation:** When accessed from a compatible browser, the app will prompt users to install it on the home screen or as a desktop app.
3. **Cache Update:** When changes are published, the Service Worker updates the cache to ensure the latest version is displayed.

## Credits and Resources
- PokeAPI: Used to retrieve Pokémon data.
- OpenStreetMap and Leaflet.js: Provides the interactive map.
- Bulma CSS: CSS framework for design and styling.

## Contributions
Contributions are welcome! If you find any issues or have suggestions to improve the app, feel free to create an issue or submit a pull request.

```plaintext

This README is formatted in Markdown for ease of use on GitHub. Copy and paste this content into a `README.md` file in your project root, and replace placeholder links like `https://your-username.github.io/your-repository/` with your actual GitHub repository URL.
```