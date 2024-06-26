# Delivery Mobile Application RESTful API

Welcome to the Delivery Mobile Application RESTful API project, created as part of my Android Course. This API serves as the backbone for the Delivery Mobile Application, providing a robust and efficient communication interface for handling various operations.

## Features

- **RESTful Architecture**: Utilizes REST principles to ensure a standardized and scalable API design.
- **Token-Based Authentication**: Implements JWT for authentication, generating key pairs to sign access tokens and refresh tokens for each user. Includes a mechanism for tracking the reuse of refresh tokens.
- **Redis Integration**: Implements Redis as an in-memory database for user shopping carts, rate limiting. 
- **Firebase Real-time Messaging**: Utilizes FCM (Firebase Cloud Messaging) to push real-time notifications to users and delivery personnel.
- **Scalability**: Designed with scalability in mind to accommodate future growth and increased demand.

## Getting Started

To get started with using the Delivery Mobile Application RESTful API, follow these steps:

1. **Set up**: Clone the repository to your local environment.
2. **Docker Installation**:
```sh
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up node-app nginx --build
```


## Documentation

For detailed information on the API endpoints and usage instructions, refer to the [API Documentation](https://documenter.getpostman.com/view/33974902/2sA3Bn5sGM).

## License

This project is licensed under the [MIT License](LICENSE).
