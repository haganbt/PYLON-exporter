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

Clone the repo:

```git clone https://github.com/datasift/SE-PYLON-exporter.git```

```cd SE-PYLON-exporter```

Install node module dependencies:

```sudo npm install```

Run tests:

```npm test```


## Usage

```node app.js```


## Quick Start

  * Edit ```/config/basic.js``` and set authentication and index credentials.
  * Run ```node app.js```. This will load and execute the ```basic.js``` config file as default.
  * Edit ```/config/basic.js``` as required.

For an example of all available config options see [/config/all.js](https://github.com/haganbt/PYLON-exporter/blob/master/config/all.js). 
To use this config file or any other, see [Config Recipes](https://github.com/datasift/SE-PYLON-exporter#config-recipes) section below.


## Config Options
Below is a summary of all supported config options.

| Option        | Scope           | Description  |
|:------------- |:-------------|:-----|
| ```app.format```      | global | Output file format. ```csv``` or ```json``` |
| ```app.write_to_file```      | global | Boolean option to output data to file. ```true``` or ```false``` |
| ```app.max_parallel_tasks```      | global | The number of tasks to run in parallel. |
| ```app.log_level```      | global | Output log level. ```debug``` shows full requests and responses. ```info```, ```warn```, ```debug``` |
| ```auth.api_key```      | global | The api key used for authentication |
| ```auth.username``` | global | The username used for authentication |
| ```end``` | global, task | end time - unix timestamp. Defaults to now UTC |
| ```filter``` | global,task | A CSDL filter to apply to all tasks |
| ```id``` | global | The recording id of the index to analyze |
| ```id``` | merged tasks | A unique identifier for each merged task result set |
| ```name``` | task | A short, human readable description of the result set |
| ```start``` | global, task | start time - unix timestamp. Defaults to now -30 days UTC |
| ```then``` | freqDist task | Used to specify custom nested task properties |
| ```then.type``` | task | Override custom nested task types |


## Authentication
todo. See ```/config/basic.js```

## Output Format
JSON and CSV output formats are supported with JSON as default. Configure the output format by setting a. ```app.format``` 
property within the configuration file: 

```json
"app": {
    "format": "json" // json, csv
    }
```

## Output Files
Output data can be exported to disk by setting an an ```app.write_to_file``` property. All files are written to the
```/output``` directory with a sub directory being created using the config file name e/g/ ```/output/test```:

```json
"app": {
    "write_to_file": false // true, false
    }
```

## Config Recipes
A JSON configuration file is used to specify what data to extract from a PYLON index.

All config files inherit (and can overwite) properties from ```/config/default.js```. This file is useful to place 
configurations you expect to use regularly e.g. primary authentication credentials.

**Config File Usage**

To specify which config file to use, set the ```NODE_ENV``` environment variable:

```export NODE_ENV=foo```

If ```NODE_ENV``` is not specified, the ```basic``` config file will be used i.e.load the ```/config/basic.js``` 
config file.

**Example Config Recipe**

To create a new config file, simply create a new ```.js``` file within the ```/config/``` directory e.g. `foo.js`. 
This file must export an object with an ```analysis``` object containing either a ```freqDist``` or ```timeSeries```
 objects or both.
 

```json
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

When run, the ```default``` config file will be loaded, followed by the ```foo``` config file. ```Foo``` will 
overwrite any duplicate values within the ```default``` file.


### Task Filters

**Filter All Tasks**

A filter can be supplied at the global level. If a global ```filter``` property is specified, it will apply across all tasks.

```json
"filter": "fb.type == \"story\"",
"analysis": {
    "freqDist": [
        ....
```

**Filter per Task**

The ```filter``` parameter is supported as expected.

```json
{
    "filter": "fb.sentiment == \"negative\"",
    "target": "fb.topics.name",
    "threshold": 2
}
```

If a global ```filter``` property is specified, it will apply across all tasks and will be joined with an **AND** to any filters specified in individual tasks. The above filters in the same config file would yield:
would yield a filter of:
```json
  "filter": "(fb.type == \"story\") and (fb.sentiment == \"negative\")"
```

### Task Names
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

### Task Time Ranges
As default, the exporter will use a 32 day time range for all tasks. This can be overridden for all tasks or
on a per task basis. Simply specify a ```start``` and/or ```end``` parameter as a unix timestamp.

As default ```end``` will be set to now and ```start``` set to now -32 days. Either parameter may be omitted.

**Override All Tasks**

To override time ranges for all tasks, specify a ```start``` and/or ```end``` parameter as a root key of the config file:

```json
"start": <UNIX_TS>,
"end":  <UNIX_TS>,
"analysis": {
    "freqDist": [
        ....
```

**Override Per Task**

For individual and nested tasks (both native and custom), simply specify as part of the task. Custom nested tasks will
automatically inherit the parent task values.

```json
{
    "start": <UNIX_TS>,
    "end":  <UNIX_TS>,
    "target": "fb.author.gender",
    "threshold": 2,
    "then": {
        "target": "fb.topics.name",
        "threshold": 2,
    }
}
```

### Merging Result Sets
Merging of response data is supported for both ```timeSeries``` and f```reqDist``` requests by grouping the request tasks
to be merged as an array. A task name property is specified as the merged tasks array key and the task array itself 
as the value:

```json
{
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
}
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

Custom nested tasks offer increased flexibility over native nested tasks by adding support for all targets (native nested 
tasks are currently restricted to low cardinality targets only). In addition, the ```filter``` property is supported 
meaning secondary tasks can query a different data set than the primary if required. The task type can also be overwritten
to support nesting timeSeries within freqDist (see "Type Property" section below).

The workflow for custom nested tasks is simple in that each result key from a primary task is used to generates 
subsequent secondary tasks by using the key as a ```filter``` parameter.

Custom nested tasks are configured within the config file using the ```then``` object:

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

The above example would generate a primary request using the ```fb.author.gender``` target. With each of the returned keys
i.e. ```male``` and ```female```, secondary requests would be made using the ```fb.topics.name``` target. This is
done by auto generating the ```filter``` parameters for the secondary tasks e.g.:

```json
"filter": "(fb.author.gender ==\"female\")"
```


**Filter Property**

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
to the primary result keys using an  ```AND``` operator. For example: 

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

If a ```filter``` parameter is specified at the global level, it will be joined with any other filters using an **AND**. For example a global filter of:
```json
  "filter": "fb.author.country_code == \"US\""
```
combined with task of:
```json
{
    "filter": "fb.sentiment == \"negative\"",
    "target": "fb.topics.name",
    "threshold": 2
}
```
would yield a filter of:
```json
  "filter": "(fb.author.country_code == \"US\") and (fb.sentiment == \"negative\")"
```

**Type Property**

It is possible to override the type of custom nested tasks for both ```freqDist``` and ```timeSeries``` by specifying a ```type``` property 
as part of the ```then``` object. This is powerful in that request types can be be mixed.

For example, you may wish to generate a timeSeries for each member of a tag tree. This could be done by specifying a timeSeries
tasks for each with a unique ```filter``` property however this could take many lines of config depending on how many tags
were within the tree. The simpler method is to do this dynamically by overriding the ```type``` from freqDist to timeSeries:

```json
"freqDist": [
    {
        "target": "interaction.tag_tree.automotive.brand",
        "threshold": 5,
        "then": {
            "type": "timeSeries", //<-- override type
            "interval": "week" //<-- timeSeries properties
        }
    }
]
```

Likewise, the reverse is possible, from timeSeries to freqDist. For example, for each week, show the top topics:

```json
"timeSeries": [
    {
        "interval": "week",
        "then": {
            "type": "freqDist", //<-- override type
            "target": "fb.topics.name", //<-- freqDist properties
            "threshold": 10
        }
    }
]
```

***NOTE: Due to the fact individual requests are used, custom nested requests can be more susceptible to redaction 
i.e. each individual request must have an audience size of > 1000 unique authors.***

## Tableau Workbook

An example Tableau workbook is provided and accompanying config recipe ```(/config/standard-tableau.js)```.
 This config recipe dynamically builds a Tableau dashboard based on a specified pre-defined tag tree. The export will 
 be most effective for high level tags like products or brands etc as each tag is drilled in to for demographics, topics and hashtags etc.
 
  * Edit the ```(/config/standard-tableau.js)```. As default this recipe will look to use a tag named ```interaction.tag_tree.standard```. It is best practice to use this naming convention for CSDL where you intend to use this export.
   If you have not used this tag naming convention, simply find and replace ```interaction.tag_tree.standard``` with the desired tag name.
  * Set the exporter to use the ```standard-tableau``` config recipe: ```export NODE_ENV=standard-tableau```
  * Run the app: ```node app.js```
  * The Tableau workbook will be output in the same dir as the output files.

**Source File Locations**

At the time of writing, Tableau partially supports relative source file paths (meaning the generated workbook and 
source ```.csv``` files  can be moved once created) however **once the notebook is saved, the source file location paths 
are then hard coded to the workbook**. If the source files or the workbook are then subsequently moved outside of the 
original dir where the workbook was first saved, the source file paths will need to be updated within the workbook. 
Simply edit the ```standard-tableau.tbw``` workbook using a text edit (its an XML file) and find/replace the ```directory='``` locations.

**Custom Tableau Recipes**

To create a custom Tableau config recipe simply copy the example ```(/config/standard-tableau.js)``` and rename accordingly.
Providing the config file name contains the string 'tableau', the default workbook will be output with the source files.


### Feature Requests and Bugs

https://github.com/haganbt/PYLON-exporter/issues
