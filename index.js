const core = require("@actions/core");
const got = require("got");

(async () => {
  try {
    const repo = core.getInput("repo");
    const userAgent =
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36";

    // get csrf token
    const response = await got("https://flows.nodered.org/add/node", {
      headers: {
        "User-Agent": userAgent,
      },
    });

    const csrfToken = /id="refresh-csrf"(.*)value="(.*)"/.exec(
      response.body
    )[2];
    const cookies = response.headers["set-cookie"];

    // make post
    const params = new URLSearchParams();
    params.append("module", repo);
    params.append("_csrf", csrfToken);

    await got("https://flows.nodered.org/add/node", {
      method: "POST",
      body: params.toString(),
      headers: {
        Referrer: `https://flows.nodered.org/node/${repo}`,
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "User-Agent": userAgent,
        Cookie: cookies[1],
      },
    });

    console.log(`${repo} refresh was submitted successfully`);
  } catch (error) {
    core.setFailed(error.message);
  }
})();
