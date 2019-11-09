
# jsfomod

*A fomod installer for Electron*

## Description

A fomod installer for electron using my [fomod library](https://github.com/Voxed/jsfomod) as a backend.

## Usage
As easy as pie!
```javascript
const {app} = require('electron')
const openInstaller = require('jsfomod-installer')

app.on('ready' () => {
    try {
        const fileMap = await openInstaller('/path/to/fomod/directory')
        // Copy files in fileMap to game directory
    } catch(error) {
        // Ooops! Either you forgot to initialize electron or
        // the installer was interrupted before completion.
    }
})
```