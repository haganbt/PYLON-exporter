# PYLON-exporter

Utility for exporting data from a PYLON index.

### Setup

Install node libs:

```sudo npm install```


### Usage

TODO.

```node app.js```

### Nested Requests

The exporter supports the ability to make secondary requests using the results of the first as targets. 
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

### Run Tests

```npm test```
