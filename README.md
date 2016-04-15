c42-ionic-example
=====================

c42-ionic-example is a Web App designed to show how to use Ionic with the [c42](http://site.calendar42.com/) platform getting, showing and acting over the events/calendars of a certain account, filtering on time and geolocation.

## Cloning

This repository needs to be cloned `recursively`.

`git clone --recursive git@github.com:calendar42/c42-ionic-example.git`

## Running

> This is a [Ionic](http://ionicframework.com/) (v1.0) based project. So most of the requirements are the basic Ionic requirements.

> If you run into any issue while the installation, please check our [Troubleshooting](https://github.com/calendar42/c42-ionic-example/tree/master/troubleshooting.md).

### Prerequisites

* [npm](https://www.npmjs.com/) following the [instructions](https://docs.npmjs.com/getting-started/what-is-npm)
* [bower](http://bower.io/) with:
```bash
$ npm install -g bower
```
* [Apache cordova](https://cordova.apache.org/) with:
```bash
$ sudo npm install -g cordova
```

We recommend using the [Ionic CLI](https://github.com/driftyco/ionic-cli) installing it individual and globally. This package will also be installed by bower, or not if is already there.

```bash
$ npm install -g ionic
```

Once it is installed is required to install the rest of dependencies. First the node requirements.

```bash
$ npm install
```

Install the bower dependencies.

```bash
$ bower install
```

Once everything is installed is required to create the file: `www/js/local_settings.js`.

This file should contain your personal keys as follow:
```
c42IonicApp.constant('local_settings', {
  googleMapsAPIKey: 'your_personal_google_maps_key',
  c42APIKey: 'your_personal_c42APIKey'
});

```

Once it is installed run:

```bash
$ ionic serve
```

Your browser should open and start the example in the url: `http://localhost:8100/`

For all information related to **c42 API** check out [the c42 docs](http://docs.calendar42.com/) and the [swaggerAPI interface](https://dev02.calendar42.com/app/django/api/docs/).

For more information about how to run and build your app in devices, generate the app to install check out how top [build/run](https://github.com/driftyco/ionic-cli#building-your-app).

> This project makes use of the [open-api](https://github.com/comlaterra/open-api-js) swagger consumer. An open source prototype designed to help the communication between client and server for API's that provides of a swagger interface.
