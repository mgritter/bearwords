# Bearwords

This is a simple word search tool meant for games like Alphabear.  It
allows you to specify letters that must be used, and an arbitrary pool of
available additional letters.

For example, "must use" ABCDEF and "may use" OLUX returns a single word: BOLDFACE, which uses all of ABCDEF as well as OL.

The algorithm is merely brute-force search on the entire dictionary. I had
thought that additional work would be needed to get an acceptable response
time, but this turned out not to be the case. On my browser the search completes
in about 250ms.

# Dev notes

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.2.4.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

