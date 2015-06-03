# PYLON-exporter

Utility for exporting data from a PYLON index. Features:
 
 * Inbuilt queue to manage requests
 * Parallel requests limit to control simultaneous requests


## Setup

Install node libs:

```sudo npm install```

Run tests:

```npm test```


## Usage

Edit ```/config/defaults.js``` and configure accordingly.

Run:

```node app.js```

### Nested Requests

The exporter supports the ability to make secondary requests using the results of the first as filter parameters. 
For example, to provide an age breakdown by domain, firstly the domains are requested, and with each of 
the result keys, an additional request is made using age as the target.

Nested requests are configured within the config file using the ```then``` object:

```json
{
    "target": "links.domain",
    "threshold": 5,
    "then": {
        "target": "fb.parent.author.age",
        "threshold": 10
    }
}
```
### Request Filters

The ```filter``` parameter is supported for primary requests as you would expect. The following example would return
the top 2 topics where the sentiment was negative:

```json
{
    "target": "fb.parent.topics.name",
    "threshold": 2,
    "filter": "fb.parent.sentiment == \"negative\""
}
```

### Override Config

TODO.

### TODO

https://github.com/haganbt/PYLON-exporter/issues
