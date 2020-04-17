# PKP Plugin Registry CLI

A set of tools by the [Public Knowledge Project](https://docs.pkp.sfu.ca/) to help with publishing new plugins for [OJS and OMP](https://docs.pkp.sfu.ca/dev/plugin-guide/en/release)

# Get Started

## Prerequisites

- Download and install Node (>v12)
- To Check if it's already installed, run `node -v` on the terminal

## Install

`npm install -g pkp-plugin-cli`

## Commands

### pkp-plugin validate-releases --input ./plugins.xml

(used internally by CI) extracts all the releases from `plugins.xml` and validate their MD5 hashes

### pkp-plugin validate-new-release

(used internally by CI) validates the new releases added to a plugin.xml file (used internally by the CI tool)

### pkp-plugin version

Outputs the version of the plugin

### pkp-plugin help

Prints help information about the tool
