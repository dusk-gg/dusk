# eslint-plugin-rune

This package is a collection of rules and configuration for writing safe logic code for the Rune Multiplayer SDK.

## Documentation

- [Logic Restrictions](https://developers.rune.ai/docs/multiplayer/logic-restrictions)

## Developing

This package is written in TypeScript and needs to be built with `yarn build`. When developing it's easiest is to run the build and test scripts in watch mode in two separate terminals:

```bash
yarn build --watch
yarn test --watch
```

## Contributing

We'd love to get your feedback these rules! Do let us know if you feel like some of our rules are excessively restrictive, or miss unsafe code. You can submit either an issue where you describe the code you want to run and why it's safe/unsafe _OR_ a pull request where we ask for both valid and invalid test cases.

## License

MIT © Rune AI Inc. 2022
