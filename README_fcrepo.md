# Building `respec-fcrepo.js`

See the [reSpec Developers Guide](https://github.com/w3c/respec/wiki/Developers-Guide) for general details. In order to update the `respec-fcrepo.js` run:

```
> npm run build:components
> node ./tools/builder.js --profile=fcrepo
```

which will update the files in `builds`, including `respec-fcrepo.js`. Copy this file into place in the fcrepo-specification directory.
