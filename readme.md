# ⚡️ zipline ⚡️
`zipline` is a microservice to zip and download files from Github.

## API
This service only has one endpoint (`/`) and only supports `GET`.

To use, simply pass in the target `user`, `repo`, and `file` as a query string. For example, to download `checkImages/checkImages.jsx` from `raa-tools`'s `indd` repo:
```
https://raa-zipline.herokuapp.com/?user=raa-tools&repo=indd&file=checkImages%2FcheckImages.jsx
```

Remember to escape forward slashes (as `%2F`) and spaces (`%20`).

When downloading multiple files, every file's `user` and `repo` must be specified:
```
https://raa-zipline.herokuapp.com/?user=raa-tools&repo=indd&file=checkImages%2FcheckImages.jsx&user=raa-tools&repo=indd&file=batchConvert%2FbatchConvert.jsxbin
```

### Specifying Branches
By default, `zipline` will download from the `master` branch. To specify a different branch, simply pass it as part of the query string.

**Note:** When downloading multiple files, if the branch for one file is specified, the branch for all other files must be specified.

```
https://raa-zipline.herokuapp.com/?user=raa-tools&repo=indd&branch=master&file=checkImages%2FcheckImages.jsx&user=raa-tools&repo=indd&branch=dev&file=batchConvert%2FbatchConvert.jsxbin
```
