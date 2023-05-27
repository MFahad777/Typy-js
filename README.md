# Typy-JS

> A validation package for express js to validate incoming request payload.
> It internally utilizes the express-validator library for input validation in Express.js applications.
 
For more practical examples, please see tests suite, 
there is separate test suite for each validation API.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [Installation](#installation)
- [API](#api)
  - [Validation.required(validation_options)](#validationrequiredvalidation_options)
    - [Example](#example)
  - [Validation.integer(validation_options)](#validationintegervalidation_options)
    - [Example](#example-1)
  - [Validation.isArray(validation_options)](#validationisarrayvalidation_options)
    - [Example](#example-2)
  - [Validation.custom(validation_options)](#validationcustomvalidation_options)
    - [Example](#example-3)
  - [Validation.in(validation_options)](#validationinvalidation_options)
    - [Example](#example-4)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Installation

```shell
npm i typy-js

OR

npm install typy-js
```

# API

## Validation.required(validation_options)

A function that returns a validation middleware for checking if a field is required.

`validation_options (Optional)` 
- `customFunction (Optional)`: A custom validation function to be executed instead of the default validation.
- `checkIn (Optional)`: Specifies the location to check the field (e.g., "body", "query", "params"). Default is 'any'
- `message (Optional)`: Custom error message for the validation failure.

### Example

```javascript
const { Rule, Validation } = require("typy-js");

// Without any validation options
const postCreateRule = new Rule({
    name:[
        Validation.required()
    ],
    body:[
        Validation.required()
    ]
})

app.post("/post",
    postCreateRule.createValidation(),
    postCreateRule.showValidationErrors(),
    (req,res) => {
    res.json("Successfully Passed All Validation")
});


// With CheckIn and Message Param
const postCreateRule = new Rule({
    name:[
        Validation.required({
            checkIn:"query", // "params", "body",
            message:"The name field is required and must be passed",
        })
    ],
    body:[
        Validation.required({
            checkIn:"body", // Yes, you can have different location,
            message:"The name field is required and must be passed",
        })
    ]
})

// With CustomFunction
const postCreateRule = new Rule({
    name:[
        Validation.required({
            checkIn:"query",
            customFunction: ({value, requestObject, field, param}) => {
                return Boolean(value) 
                    ? Promise.resolve() 
                    : Promise.reject("With Custom Function");
            }
        })
    ],
    body:[
        Validation.required({
            checkIn:"query",
            customFunction: ({value, requestObject, field, param}) => {
                return Boolean(value) 
                    ? Promise.resolve() 
                    : Promise.reject("With Custom Function");
            }
        })
    ]
})
```

## Validation.integer(validation_options)

A function that returns a validation middleware for checking if a field is an integer.

`validation_options (Optional)`
- `customFunction (Optional)`: A custom validation function to be executed instead of the default validation.
- `checkIn (Optional)`: Specifies the location to check the field (e.g., "body", "query", "params"). Default is 'any'
- `message (Optional)`: Custom error message for the validation failure.

### Example

```javascript
const { Rule, Validation } = require("typy-js");

// Without any validation options
const getPostRule = new Rule({
    id:[
        Validation.integer()
    ]
})

app.get("/post",
    getPostRule.createValidation(),
    getPostRule.showValidationErrors(),
    (req,res) => {
    res.json("Successfully Passed All Validation")
});


// With CheckIn and Message Param
const getPostRule = new Rule({
    id:[
        Validation.integer({
            checkIn:"query",
            message:"The id field must be of type integer",
        })
    ]
})

// With CustomFunction
const getPostRule = new Rule({
    id:[
        Validation.integer({
            checkIn:"query",
            customFunction: ({value, requestObject, field, param}) => {
                return Boolean(value) 
                    ? Promise.resolve() 
                    : Promise.reject("With Custom Function");
            }
        })
    ]
})
```

## Validation.isArray(validation_options)

A function that returns a validation middleware for checking if a field is an integer.

`validation_options (Optional)`
- `customFunction (Optional)`: A custom validation function to be executed instead of the default validation.
- `checkIn (Optional)`: Specifies the location to check the field (e.g., "body", "query", "params"). Default is 'any'
- `message (Optional)`: Custom error message for the validation failure.
- `params (Optional)`
  - `min (Optional)` : Minimum number of elements allowed in the array.
  - `max (Optional)`: Maximum number of elements allowed in the array.

### Example

```javascript
const { Rule, Validation } = require("typy-js");

// Without any validation options
const getPostRule = new Rule({
    id:[
        Validation.integer()
    ]
})

app.get("/post",
    getPostRule.createValidation(),
    getPostRule.showValidationErrors(),
    (req,res) => {
    res.json("Successfully Passed All Validation")
});


// With CheckIn and Message Param
const getPostRule = new Rule({
    id:[
        Validation.integer({
            checkIn:"query",
            message:"The id field must be of type integer",
        })
    ]
})

// With CustomFunction
const getPostRule = new Rule({
    id:[
        Validation.integer({
            checkIn:"query",
            customFunction: ({value, requestObject, field, param}) => {
                return Boolean(value) 
                    ? Promise.resolve() 
                    : Promise.reject("With Custom Function");
            }
        })
    ]
})
```

## Validation.custom(validation_options)

A function that returns a validation middleware defined by the user.

`validation_options (Required)`
- `customFunction (Required)`: A custom validation function to be executed instead of the default validation.
- `checkIn (Optional)`: Specifies the location to check the field (e.g., "body", "query", "params"). Default is 'any'
- `params (Optional)`: Any extra values to be passed to the custom function

### Example

```javascript
const { Rule, Validation } = require("typy-js");

const createUserRule = new Rule({
  name:[
    Validation.custom({
      customFunction:({value, requestObject, field, param}) => {
        return value.length > 5 ? Promise.resolve() : Promise.reject(`${field} length must be greater than 5`);
      }
    })
  ]
});

app.post("/post",
        createUserRule.createValidation(),
        createUserRule.showValidationErrors(), 
        (req,res) => {
    res.json("Successfully Passed All Validation")
});
```

## Validation.in(validation_options)

A function that returns a validation middleware defined by the user.

`validation_options (Required)`
- `message (Required)`: A custom message.
- `checkIn (Optional)`: Specifies the location to check the field (e.g., "body", "query", "params"). Default is 'any'
- `params (Required)`: Required params
  - `values (Required)` : Can be string or number or any value.

### Example

```javascript
const { Rule, Validation } = require("typy-js");

const createUserRule = new Rule({
  roleName:[
    Validation.in({
      params:{
        values:['Admin','User']
      }
    })
  ]
});

app.post("/post",
        createUserRule.createValidation(),
        createUserRule.showValidationErrors(), 
        (req,res) => {
    res.json("Successfully Passed All Validation")
});
```

# License 
MIT