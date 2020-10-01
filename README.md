# node-red-update-flow
Make a request to the Node Red Flows catalogue to reindex the latest version

## Inputs

### `repo`

**Required** The name of the repo to update

## Example usage

uses: actions/node-red-flow-update@v1
with:
  repo: 'node-red-contrib-bluelinky'