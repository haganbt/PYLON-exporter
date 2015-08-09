# PYLON-exporter

Utility for exporting data from a PYLON index. PYLON-exporter mandates a config driven approach to data collection, 
rather than code. It is the goal of this utility to support any combination of data extraction from a PYLON index.

Features:
 
 * Simplified config driven approach abstracts complexities of data collection and merging
 * Inbuilt queue to support large numbers of requests
 * Parallel requests limit to manage control flow
 * Custom result set merging
 * Nested requests - native and custom
 * Export as JSON or CSV


## Setup

If Node is not installed, install it from https://nodejs.org/. Once complete, check by running ```node -v``` from a 
terminal window to show the install version.

Install node module dependencies:

```sudo npm install```

Run tests:

```npm test```


## Usage

```node app.js```


## Quick Start

todo


## Config Recipes

As JSON configuration file is used to specify what data to extract from a PYLON index.

All config files inherit (and can overwite) properties from ```/config/default.js```. This file is useful to place 
configurations you expect to use regularly e.g. primary authentication credentials.

To specify which config file to use, set the ```NODE_ENV``` environment variable:

```export NODE_ENV=foo```

If ```NODE_ENV``` is not specified, the ```test``` config file will be used i.e.load the ```/config/test.js``` 
config file.

**Example Config Recipe**

To create a new config file, simply create a new ```.js``` file within the ```/config/``` directory e.g. `foo.js`. 
This file must export an object with an ```analysis``` object containing either a ```freqDist``` or ```timeSeries```
 objects or both.
 

```json
 "use strict";
 
 module.exports = {
     "analysis": {
         "freqDist": [
             {
                 "target": "fb.author.gender",
                 "threshold": 2
             }
         ],
         "timeSeries": [
             {
                 "interval": "week",
                 "span": 1
             }
         ]
     }
 };
 
 ```

Set the config file using an environment variable:

```export NODE_ENV=foo```


When run, the ```default``` config file will be loaded, followed by the ```foo``` config file. ```Foo``` will 
overwrite any duplicate values within the ```default``` file.


### Request Filters

The ```filter``` parameter is supported as expected.

```json
{
    "filter": "fb.sentiment == \"negative\"",
    "target": "fb.topics.name",
    "threshold": 2
}
```

### Task names
Task names are used to provide a short, human readable description of the result set being generated which is included
as part of the output. If files are being generated, the ```name``` property is also used as the file name.

```json
{
    "name": "freqDist_topics_sentiment_negative", //<-- task name
    "filter": "fb.sentiment == \"negative\"",
    "target": "fb.topics.name",
    "threshold": 2
}
```


### Merging Result Sets
Merging of response data is supported for both timeSeries and freqDist requests by grouping the request tasks
to be merged as an array. A task name property is specified as the merged tasks array key and the task array itself 
as the value:

```json
"timeSeries_brands_by_week": [ //<-- task name
    {
        "id": "ford", //<-- task id
        "filter": "fb.content contains \"ford\"",
        "interval": "week",
        "span": 2
    },
    {
        "id": "honda",
        "filter": "fb.content contains \"honda\"",
        "interval": "week",
        "span": 2
    }
]
```

**Task ID**

An ```id``` property can be specified to identify each data set within a merged task with a human readable name. For
example, using the sample configuration above where ```id``` properties have been specified as ```ford``` and 
```honda``` would return the following JSON response:

```json
 {
      "ford": [
          {
              "key": "25-34",
              "interactions": 565500,
              "unique_authors": 432800
          },
          ....
      ],
      "honda": [
          {
              "key": "25-34",
              "interactions": 366500,
              "unique_authors": 296600
          },
          ....
      ]
  }
```

If an ```id``` is not specified, the exporter will attempt to automatically generate one. The ```target``` property 
will be used as default if present. If the ```target``` is not specified (e.g. time series) or is a duplicate, 
the ```filter``` property will be used. If the ```filter``` is a duplicate a concatenation of the ```target``` 
and ```filter``` property is used.


### Nested Tasks

Two types of nested tasks are supported: **native** nested and **custom** nested tasks:

**Native Nested Tasks**

Native nested tasks are supported using the same simplified format using a ```child``` object:

```json
"freqDist": [
    {
        "name": "example_native_nested",
        "target": "fb.author.gender",
        "threshold": 2,
        "child": {
            "target": "fb.author.age",
            "threshold": 2,
            "child": {
                "target": "fb.media_type",
                "threshold": 2
            }
        }
    }
]    
```            

**Custom Nested Tasks**

Custom nested tasks offer two significant advantages over native nested tasks. Firstly, any targets can be used for
both primary and secondary tasks. Native nested tasks are currently restricted to low cardinality targets only. 
Secondly, the ```filter``` property is supported meaning the secondary tasks can query a different data set than
the primary if required.

The workflow for custom nested tasks is simple in that each result key from a primary request is used to generates 
subsequent secondary requests by using the key as a ```filter``` parameter.

Nested requests are configured within the config file using the ```then``` object:

```json
"freqDist": [
    {
        "name": "freqDist_topics_by_gender",
        "target": "fb.author.gender",
        "threshold": 2,
        "then": {
            "target": "fb.topics.name",
            "threshold": 5
        }
    }
]
```

The above example would make a primary request using the ```fb.author.gender``` target. With each of the returned keys
i.e. ```male``` and ```female```, secondary requests would be made using the ```fb.topics.name``` target. This is
done by auto generating the ```filter``` parameters for the secondary tasks e.g.:

```json
"filter": "(fb.author.gender =="female")"
```

***NOTE: Due to the fact individual requests are used, custom nested requests can be more susceptible to redaction 
i.e. each individual request must have an audience size of > 1000 unique authors.***


**Using Filters with Custom Nested Tasks**

The ```filter``` property is supported as part of both a primary, secondary or both tasks. Currently these filters 
operate independently i.e. specifying a filter in the primary task does not in any way get applied to secondary 
tasks.

```json
{
    "filter": "fb.sentiment == \"positive\"",
    "target": "links.domain",
    "threshold": 5,
    "then": {
        "target": "fb.gender",
        "threshold": 2
    }
}
```

Specifying a ```filter``` as part of a secondary task results in the secondary filter being automatically appended 
to the primary result keys using an  ```AND`` operator. For example: 

```json
{
    "target": "fb.type",
    "threshold": 4,
    "then": {
        "filter": "fb.author.gender == \"male\"",
        "target": "fb.author.age",
        "threshold": 2
    }
}
```
This would generate the following request for each ```fb.type``` key:

```json
  "filter": "(fb.author.gender == \"male\") AND fb.type ==\"like\""
```

Of course both primary and secondary ```filter``` parameters can be used together. For example, if we wanted results
for Male authors only for both the primary request and secondary:

```json
{
    "target": "fb.type",
    "threshold": 4,
    "filter": "fb.author.gender == \"male\"",
    "then": {
        "target": "fb.topics.name",
        "threshold": 2
        "filter": "fb.author.gender == \"male\"",
    }
}
```            

### Feature Requests and Bugs

https://github.com/haganbt/PYLON-exporter/issues
