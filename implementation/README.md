# Master's Thesis Implementation

The implementation is sectioned into three separate services:
- [booking service](./booking-service/),
- [booking API gateway](./booking-api-gateway/),
- [booking client application](./booking-client-app/).

For development, follow the instructions in the individual services' `README` files.

For production use, the Compose file [`compose.prod.yaml`](./compose.prod.yaml) is available, and can be run using the command `docker compose -f compose.prod.yaml up -d` (and then `docker compose -f compose.prod.yaml down` to shut the services down). After start-up, the booking client application will be available by default on <http://localhost:8080> and the API gateway on <http://localhost:3080>. There will also be the booking service itself, available on <http://localhost:3000>, but the service should be used through the API gateway.

For production deployment, make sure to change the GitHub OAuth key and secret in the API gateway environment variables, from the one provided by SuperTokens for development and testing. Additionally, make sure to only make the `8080` and `3080` ports public (and ideally change `8080` to `80`). Lastly, a secured HTTPS connection must be used when using booking service outside localhost.

## License

Everything here is licensed under the permissive [MIT license](./LICENSE.txt).
