const { EventEmitter } = require("events");
const path = require("path");
const axios = require("axios").default;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class MissingArgumentError extends Error {
  constructor(missing) {
    super("Missing argument: " + missing);
  }
}

class Updater extends EventEmitter {
  /**
   *
   * @param {Object|String} pkg The package.json of the project
   * @param {Object} options Options
   * @param {Providers} options.provider Provider of the checker
   * @param {Object} options.github Github
   * @param {String} options.github.owner Github owner
   * @param {String} options.github.repository Github repository
   */
  constructor(pkg, options = {}) {
    super();
    this.options = options;
    if (options.provider === Providers.Github && options.github) {
      this.providerOptions = options.github;
    } else {
      if (!options.provider) throw new MissingArgumentError("options.provider");
      if (!options.github) throw new MissingArgumentError("options.github");
    }
    this.package =
      pkg instanceof Object
        ? pkg
        : require(path.resolve(process.cwd(), "package.json"));
  }

  async check() {
    return await new Promise(async (resolve, reject) => {
      switch (this.options.provider) {
        case Providers.Github:
          let res = await this.checkGithub().catch(async () => {
            await this.checkGithub(true).catch(reject);
          });
          resolve(res);
          break;
        default:
          throw new Error("Unknown provider");
      }
    });
  }

  async checkGithub(usePackage = false) {
    return await new Promise(async (resolve, reject) => {
      const { owner, repository } = this.providerOptions;
      if (!owner) throw new MissingArgumentError("providerOptions.owner");
      if (!repository)
        throw new MissingArgumentError("providerOptions.repository");
      if (usePackage) {
        const url = `https://api.github.com/repos/${owner}/${repository}/contents/package.json`;
        const res = await axios.get(url, {
          headers: { Accept: "application/vnd.github.v3+json" },
        });
        const data = res.data;
        const json = JSON.parse(Buffer.from(data.content, "base64").toString());
        const latestVersionNumber = json.version;
        const currentVersionNumber = this.package.version;
        if (latestVersionNumber > currentVersionNumber) {
          this.emit("update", {
            version: currentVersionNumber,
            latestVersion: latestVersionNumber,
            setupURL: null,
          });
          resolve(json);
        } else {
          this.emit("noUpdate");
          resolve(false);
        }
        return;
      }
      const url = `https://api.github.com/repos/${owner}/${repository}/releases/latest`;
      try {
        const res = await axios.get(url);
        const latest = res.data;
        const latestVersion = latest.tag_name;
        const latestVersionNumber = latestVersion.replace(/^v/, "");
        const currentVersionNumber = this.package.version;
        if (latestVersionNumber > currentVersionNumber) {
          this.emit("update", {
            version: currentVersionNumber,
            latestVersion: latestVersionNumber,
            setupURL: latest.assets[0].browser_download_url,
          });
          resolve(latest);
        } else {
          this.emit("noUpdate");
          resolve(false);
        }
      } catch (err) {
        reject(err.response.status + " " + err.response.statusText);
      }
    });
  }
}

class Providers {
  // Create new instances of the same class as static attributes
  static Github = new Providers("Github");

  constructor(name) {
    this.name = name;
  }
}

module.exports = {
  Updater,
  Providers,
};
