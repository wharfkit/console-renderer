# @wharfkit/console-renderer

A plugin to allow users to interact with Wharf Kit in a console.

## Installation

Install the plugin with

    yarn add @wharfkit/console-renderer

## Usage

Use the plugin when instantiating a Wharf Kit session:

        import { Session } from '@wharfkit/core';
        import { ConsoleRenderer } from '@wharfkit/console-renderer';

        const session = new Session({
            ...
            ui: [
                new ConsoleRenderer(),
            ],
        });s

## Developing

You need [Make](https://www.gnu.org/software/make/), [node.js](https://nodejs.org/en/) and [yarn](https://classic.yarnpkg.com/en/docs/install) installed.

Clone the repository and run `make` to checkout all dependencies and build the project. See the [Makefile](./Makefile) for other useful targets. Before submitting a pull request make sure to run `make lint`.

## Testing

To run the unit tests, run:

    make test

To try out the interactive console, run:

    make test-cli

---

Made with ☕️ & ❤️ by [Greymass](https://greymass.com), if you find this useful please consider [supporting us](https://greymass.com/support-us).
