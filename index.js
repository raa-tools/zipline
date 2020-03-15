const archiver = require("archiver");
const { send } = require("micro");

const { downloadFileName } = require("./config");
const qs = require("./utils/querystring");
const makeError = require("./utils/makeError");
const fetchAndZip = require("./utils/fetchAndZip");

module.exports = async (req, res) => {
  res.setHeader("Content-Type", "application/zip");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${downloadFileName}`
  );

  try {
    if (req.method !== "GET") {
      throw makeError(400, "Only 'GET' is supported.");
    }

    // Will throw Error if check fails
    const query = qs.parse(req.url.split("?")[1]);
    const { user, repo, branch, file } = query;

    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.pipe(res);

    for (let i = 0; i < user.length; i++) {
      const _user = user[i];
      const _repo = repo[i];
      const _branch = branch[i];
      const _file = file[i];
      const url = `https://raw.githubusercontent.com/${_user}/${_repo}/${_branch}/${_file}`;
      await fetchAndZip(url, archive, _file);
    }

    archive.finalize();
  } catch (e) {
    send(res, e.statusCode, e.message);
  }
};
