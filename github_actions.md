# Run github action

https://docs.github.com/en/free-pro-team@latest/actions

rename file for actions to test.yaml

# This is a basic workflow to help you get started with Actions

name: tests

# Controls when the action will run.

on:
pull_request

# A workflow run is made up of one or more jobs that can run sequentially or in parallel

jobs:

# This workflow contains a single job called "build"

build: # The type of runner that the job will run on
runs-on: ubuntu-latest

    # Steps represent a sequence of tasks that will be executed as part of the job
    steps:
      # Checks-out your repository under $GITHUB_WORKSPACE, so your job can access it
      - uses: actions/checkout@v2

      - run: cd auth && yarn && yarn run test:ci
