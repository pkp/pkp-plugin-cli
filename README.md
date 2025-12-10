# PKP Plugin Release CLI Tool

A set of tools by the [Public Knowledge Project](https://docs.pkp.sfu.ca/) to help with publishing new plugins for OJS, OMP, and OPS. [Learn more in the Plugin Guide](https://docs.pkp.sfu.ca/dev/plugin-guide/en/release).

## Prerequisites

Download and install Node (>v12), or check if it's already installed with `node -v`.

If you are releasing a new version of a plugin, you will need to generate a personal access token on GitHub.

## Install

To install the tool, run:

```
npm install -g pkp-plugin-cli
```

To update the tool, run:

```
npm update -g pkp-plugin-cli
```

## Usage

To get help information about the tool, run:

```
pkp-plugin help
```

Use the following to build a release package and upload it as a release to your repository on GitHub, replacing the plugin name and version number with your own:

```
pkp-plugin release pluginName --newversion 1.0.0.0
```

Use the following to release a new version of a plugin from within a plugin directory, detect the version to update to, build a release package, and release it on GitHub:

```
pkp-plugin bump
```

Outputs the installed version of the plugin release tool:

```
pkp-plugin version
```

Used internally by CI to extract all the releases from `plugins.xml` and validate their MD5 hashes:

```
pkp-plugin validate-all-releases --input ./path/to/plugins.xml
```

Used internally by CI to validate the new release added to `plugins.xml`:

```
pkp-plugin validate-new-release
```

Used internally by CI to generate a website reflecting the state of the plugin gallery's `plugins.xml`:

```
pkp-plugin generate-site --input file/input.xml
```

## Publishing an updated npm package

Install [np package](https://github.com/sindresorhus/np) globally:

```
npm install --global np
```

Then, run `np` on the command line and follow the wizard.
