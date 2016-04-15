c42-ionic-example Troubleshooting
=====================

### Problem installing npm dependencies

After running

```bash
$ npm install
```

If you run into any error update your npm and run again the same command:

```bash
$ npm update npm -g
$ npm install
```

### Some questions while installing bower dependencies

Some of the components installation will result in the following questions.

```
Unable to find a suitable version for ionic, please choose one:
    1) ionic#~1.0.0 which resolved to 1.0.1 and is required by ionic-material#0.4.2
    2) ionic#1.2.4 which resolved to 1.2.4 and is required by c42-ionic

    Prefix the choice with ! to persist it to bower.json
```

`Answer: 1`

```
Unable to find a suitable version for angular-animate, please choose one:
    1) angular-animate#1.3.13 which resolved to 1.3.13 and is required by ionic#1.0.1
    2) angular-animate#1.4.3 which resolved to 1.4.3 and is required by ionic#1.2.4

Prefix the choice with ! to persist it to bower.json
```

`Answer 1`

```
Unable to find a suitable version for angular-sanitize, please choose one:
    1) angular-sanitize#1.3.13 which resolved to 1.3.13 and is required by ionic#1.0.1
    2) angular-sanitize#1.4.3 which resolved to 1.4.3 and is required by ionic#1.2.4

Prefix the choice with ! to persist it to bower.json
```

`Answer: 1`
