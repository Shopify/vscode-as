# Change Log

All notable changes to the "vscode-as" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [0.4.0]

### Added

- [Runtime] - Improve unmet dependencies error
- [Extension] - Add a TS plugin to automatically detect AS sources
- [Server binary] - Bundle server for darwin and linux

### Deprecated

- [Setup] - No need to disable TS validation manually


## [0.3.3] - 2020-09-15

### Added

- [Runtime] - Added a runtime module to ensure runtime dependencies are met
- [Extension] - Dynamic port assignment
- [Command] - Dynamic command derivation, the fallback is always the system installation of the language server
- [Extension] - Log which command is the server started from
- **Note:** this version, requires the AssemblyScript Language Server version to be at least v0.5.0

