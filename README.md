<p align="center">
  <a href="" rel="noopener">
 <img width=200px height=200px src="https://www.mime.ga/assets/images/logo.png" alt="Project logo"></a>
</p>

<h3 align="center">Mime UpdateChecker</h3>

<div align="center">

[![Version](https://img.shields.io/npm/v/mime-updatecheck)]()
[![GitHub Issues](https://img.shields.io/github/issues/Mimexe/UpdateChecker.svg)](https://github.com/Mimexe/UpdateChecker/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/Mimexe/UpdateChecker.svg)](https://github.com/Mimexe/UpdateChecker/pulls)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>

---

<p align="center"> Check with github if package is up to date.
    <br> 
</p>

## 📝 Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Usage](#usage)
- [Built Using](#built_using)
- [Authors](#authors)

## 🧐 About <a name = "about"></a>

Check with Github if package is up to date with package.json or release.

## 🏁 Getting Started <a name = "getting_started"></a>

### Prerequisites

What things you need to install the software and how to install them.

```
Node v16
Package.json
Github Repo
```

### Installing

Install the package with npm

```
npm i mime-updatecheck
```

## 🎈 Usage <a name="usage"></a>

Declare the class
```js
const { Updater, Providers } = require("mime-updatecheck")
const updater = new Updater("./package.json" /*or require("./package.json")*/, {provider: Providers.Github, github: { owner: "UserOrOrganization", repository: "Repository to check"} })
```
Add events
```js
updater.on("update", (data) => {
    console.log("New update: "+data)
    /*
    data: {version: String, latestVersion: String, setupURL: String} setupURL only on Github Release
    */
})
updater.on("noUpdate", () => {
    console.log("No update available")
})
```
And check for update
```js
// ...
updater.check()/*.then(console.log)*/
```
Your update checker is setuped !  
Full code:
```js
// Declare
const { Updater, Providers } = require("mime-updatecheck")
const updater = new Updater("./package.json" /*or require("./package.json")*/, {provider: Providers.Github, github: { owner: "UserOrOrganization", repository: "Repository to check"} })

// Listen for events
updater.on("update", (data) => {
    console.log("New update: "+data)
})
updater.on("noUpdate", () => {
    console.log("No update available")
})

// Check for update
updater.check()
```

## ⛏️ Built Using <a name = "built_using"></a>

- [NodeJs](https://nodejs.org/en/) - Server Environment
- [Axios](https://npmjs.com/package/axios) - HTTP Request

## ✍️ Authors <a name = "authors"></a>

- [@Mimexe](https://github.com/Mimexe) - Idea & Initial work

See also the list of [contributors](https://github.com/Mimexe/UpdateChecker/contributors) who participated in this project.
