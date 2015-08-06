# PYLON-exporter

Utility for exporting data from a PYLON index. PYLON-exporter mandates a config driven approach to data collection, 
rather than code. It is the goal of this utility to support any combination of data extraction from a PYLON index.

Features:
 
 * Simplified config driven approach abstracts complexities of data collection and merging
 * Inbuilt queue to support large numbers of requests
 * Parallel requests limit to manage control flow
 * Data merging
 * Nested requests - native as well as custom nested requests
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


## Config Recipes

As JSON configuration file is used to specify what data to extract from a PYLON index.

All config files inherit (and can overwite) properties from ```/config/default.js```. This file is useful to place 
configurations you expect to use regularly e.g. primary authentication credentials.

To specify which config file to use, set the ```NODE_ENV``` environment variable:

```export NODE_ENV=foo```

If ```NODE_ENV``` is not specified, it will automatically default to ```test``` i.e. load the ```/config/test.js``` 
config file.

**Example Config Recipe**

Create a new file within the ```/config/``` directory e.g. `foo.js` with the following configuration:
 

```json
 "use strict";
 
 module.exports = {
     "analysis": {
         "freqDist": [
             {
                 "target": "fb.parent.author.gender",
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

### Merging Result Sets
Merging of response data is supported for both timeSeries and freqDist requests by grouping the request tasks
to be merged as an array:

```json
"timeSeries_brands_by_week": [ //<-- task name
    {
        "id": "ford", //<-- task id
        "filter": "fb.parent.content contains \"ford\"",
        "interval": "week",
        "span": 2
    },
    {
        "id": "honda",
        "filter": "fb.parent.content contains \"honda\"",
        "interval": "week",
        "span": 2
    }
]
```

**Task ID**

An ```id``` property can be specified to identify each data set within a merged task with a human readable name. For
example, using the example configuration above where ```id``` properties have been specified as ```ford``` and 
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


**Task Name**

Task names are used to provide a short description of the result set and also used for output file names.

A task name property is specified as the merged tasks array key and the task array itself as the value:

```json
"the_name_of_the_merged_task": [ //<-- task name
    {
        ... // task 1
    },
    {
        ... // task 2
    }
]
```


### Nested Requests

Two types of nested requests are supported: **native** nested and **custom** nested requests:

**Native Nested Requests

Native nested requests are supported using the same simplified format:

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
                "target": "fb.parent.media_type",
                "threshold": 2
            }
        }
    }
]    
```            

**Custom Nested Requests**

Custom nested requests offer the flexibility to use any combination of targets for requests.

Each result key from a primary request then automatically generates a subsequent secondary request using the key 
as a ```filter``` parameter.

Nested requests are configured within the config file using the ```then``` object:

```json
"freqDist": [
    {
        "name": "freqDist_age_by_gender",
        "target": "fb.parent.author.gender",
        "threshold": 2,
        "then": {
            "target": "fb.parent.author.age",
            "threshold": 6
        }
    }
]
```


### Request Filters

The ```filter``` parameter is supported as expected.

```json
{
    "filter": "fb.parent.sentiment == \"negative\"",
    "target": "fb.parent.topics.name",
    "threshold": 2
}
```

##To be re-written

**Nested Filters - Primary**

The ```filter``` property can also be used within nested queries:

```json
{
    "filter": "fb.sentiment == \"positive\"",
    "target": "links.domain",
    "threshold": 5,
    "then": {
        "target": "fb.parent.gender",
        "threshold": 2
    }
}
```
In this instance, the ```filter``` parameter is ***ONLY applied to the primary*** request, not the secondary requests. 
The first request would be made for the top 5 domains where the sentiment is positive. For each of the domains 
returned, a subsequent request is made for the gender. These ***secondary requests DO NOT include the filter*** for 
sentiment as it was only specified as part of the primary request.

**Nested Filters - Secondary**

Specifying a ```filter``` within a nested query results in the specified filter being appended to the automatically 
generated filters using an  ```AND`` operator. For example: 

```json
{
    "target": "fb.type",
    "threshold": 4,
    "then": {
        "filter": "fb.parent.author.gender == \"male\"",
        "target": "fb.parent.author.age",
        "threshold": 2
    }
}
```
This would generate the following request for each type:

```json
{
  "parameters": {
    "analysis_type": "freqDist",
    "parameters": {
      "target": "fb.parent.author.age",
      "threshold": 2
    }
  },
  "filter": "fb.parent.author.gender == \"male\" AND fb.type ==\"like\""
}
```

Of course both primary and secondary ```filter``` parameters can be used together. For example, if we wanted results
for Male authors only for both the primary request and secondary:

```json
{
    "target": "fb.type",
    "threshold": 4,
    "filter": "fb.parent.author.gender == \"male\"",
    "then": {
        "target": "fb.parent.topics.name",
        "threshold": 2
        "filter": "fb.parent.author.gender == \"male\"",
    }
}
```            

### TODO

https://github.com/haganbt/PYLON-exporter/issues
