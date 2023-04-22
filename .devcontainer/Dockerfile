# See here for image contents: https://github.com/microsoft/vscode-dev-containers/tree/v0.209.5/containers/javascript-node/.devcontainer/base.Dockerfile

# [Choice] Node.js version (use -bullseye variants on local arm64/Apple Silicon): 16, 14, 12, 16-bullseye, 14-bullseye, 12-bullseye, 16-buster, 14-buster, 12-buster

FROM --platform=$BUILDPLATFORM mcr.microsoft.com/vscode/devcontainers/javascript-node:0-18-bullseye

RUN rm -rf /etc/apt/sources.list.d/yarn.list \
 && wget -qO - https://raw.githubusercontent.com/yarnpkg/releases/gh-pages/debian/pubkey.gpg | apt-key add -

RUN apt-get update && export DEBIAN_FRONTEND=noninteractive


