# PYLON-exporter

Utility for exporting data from a PYLON index. Features:
 
 * Inbuilt queue to manage requests
 * Parallel requests limit to control simultaneous requests
 * Support for nested requests automatically using result keys as request filters 


## Setup

Install node module dependencies:

```sudo npm install```

Run tests:

```npm test```


## Usage

Edit ```/config/defaults.js``` and configure accordingly.

Run:

```node app.js```

### Nested Requests

Nested requests are supported whereby each result key from a primary request then automatically generates
a subsequent secondary request using the key as a filter parameter.

Nested requests are configured within the config file using the ```then``` object:

```json
{
    "target": "fb.parent.author.gender",
    "threshold": 2,
    "then": {
        "target": "fb.parent.author.age",
        "threshold": 6
    }
}
```

The above example would generate the following requests:

Primary:

```json
{
  "parameters": {
    "analysis_type": "freqDist",
    "parameters": {
      "target": "fb.parent.author.gender",
      "threshold": 2
    }
  }
}
```

Secondary:

```json
{
  "parameters": {
    "analysis_type": "freqDist",
    "parameters": {
      "target": "fb.parent.author.age",
      "threshold": 6
    }
  },
  "filter": "fb.parent.author.gender ==\"male\""
}


{
  "parameters": {
    "analysis_type": "freqDist",
    "parameters": {
      "target": "fb.parent.author.age",
      "threshold": 6
    }
  },
  "filter": "fb.parent.author.gender ==\"female\""
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
