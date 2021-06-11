const core = require("@actions/core");
const got = require("got");
const { CookieJar } = require("tough-cookie");

let repo = "";

// Allow testing locally
if (process.env.CI) {
  repo = core.getInput("repo");
} else {
  repo = process.argv[2];
}

(async () => {
  const cookieJar = new CookieJar();
  const userAgent =
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36";

  // get csrf + cookies
  const response = await got(`https://flows.nodered.org/node/${repo}`, {
    headers: {
      Referrer: `https://flows.nodered.org/node/${repo}`,
      "User-Agent": userAgent,
    },
    cookieJar,
    throwHttpErrors: false,
  });

  const csrfToken = /name="_csrf"(.*)value="(.*)"/.exec(response.body)[2];

  // make post
  const params = new URLSearchParams();
  params.append("module", repo);
  params.append("_csrf", csrfToken);

  const postResponse = await got("https://flows.nodered.org/add/node", {
    method: "POST",
    body: params.toString(),
    headers: {
      Referrer: `https://flows.nodered.org/node/${repo}`,
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      "User-Agent": userAgent,
    },
    cookieJar,
    throwHttpErrors: false,
  });

  if (postResponse.statusCode === "200") {
    console.log(`${repo} refresh was submitted successfully`);
  } else {
    core.setFailed(postResponse.body);
  }
})();
