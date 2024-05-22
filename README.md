# Domjudge Scoreboard Live Stream Tools

![License](https://img.shields.io/github/license/jimmyhealer/DOMjudge-LiveStream)
![Version](https://img.shields.io/github/v/release/jimmyhealer/DOMjudge-LiveStream)

![Logo](src/assets/domjudge.png)

## Overview

A Domjudge Scoreboard Contest Live Stream Tools is a web application developed using Vue 3 and Express. This tool is designed to provide a live stream of the scoreboard during programming contests managed by Domjudge. It is highly customizable and easy to deploy with Docker.

## Features

- Real-time scoreboard updates
- User-friendly interface
- Easy to set up and deploy with Docker
- Developed with modern technologies: Vue 3, Express, Vite, and Bun

## Installation

### Prerequisites

- Docker
- Node.js (if running without Docker)

### Docker Deployment

1. Pull the Docker image from the repository:

   ```sh
   docker pull jimmyhealer/domjudge-live
   ```

2. Create a Docker volume:

   ```sh
   docker volume create --name live-db
   ```

3. Run the Docker container:

   ```sh
   docker run -itd -p 80:3000 -e DOMJUDGE_API=[YOUR_DOMJUDGE_URL] -e DOMJUDGE_USERNAME=[YOUR_DOMJUDGE_API_USERNAME] -e DOMJUDGE_PASSWORD=[YOUR_DOMJUDGE_API_PASSWORD] --name domjudge-live -v live-db:/app/server/volume jimmyhealer/domjudge-live
   ```

   `-e DOMJUDGE_API` is the URL of your Domjudge API. For example, `http://localhost/domjudge`.\
   `-e DOMJUDGE_USERNAME` is the username of your Domjudge API.\
   `-e DOMJUDGE_PASSWORD` is the password of your Domjudge API.

4. Access the application at `http://localhost`.

### Local Development

1. Clone the repository:

   ```sh
   git clone https://github.com/jimmyhealer/DOMjudge-LiveStream.git
   ```

2. Install dependencies:

   ```sh
   bun install
   ```

3. Start the development server:

   ```sh
   bun dev
   ```

4. Access the application at `http://localhost:5173`.

## Development

This project is developed using Vite and Bun. Vite is a fast build tool and development server, while Bun is a modern JavaScript runtime.

### Project Structure

```
.
├── src
│   ├── assets
│   ├── components
│   ├── router
│   ├── composable
│   ├── stores
│   ├── types
│   ├── utils
│   ├── views
│   ├── App.vue
│   └── main.ts
├── server
|   ├── src
│       └── index.js
├── Dockerfile
└── package.json
```

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contact

If you have any questions or need further assistance, you can issue a request in the repository. Or feel free to contact us at [yahing6066@gmail.com](mailto:yahing6066@gmail.com).

## Acknowledgements

- This project was inspired by and references logic and methods from [CCUPCxDS Live Tools](https://gitlab.com/kennhung/CCUPCxDS_live_tools).
- Visual design elements were inspired by the [2024 ICPC World Final live stream](https://www.youtube.com/watch?v=an5sBhtktaE&t=6191s&ab_channel=ICPCLive).
- Special thanks to Domjudge for their excellent platform and support.
