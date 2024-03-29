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
  - [Validation.notIn(validation_options)](#validationnotinvalidation_options)
    - [Example](#example-5)
  - [Validation.rangeOrBetween(validation_options)](#validationrangeorbetweenvalidation_options)
    - [Example](#example-6)
  - [Validation.isObject(validation_options)](#validationisobjectvalidation_options)
    - [Example](#example-7)
  - [Validation.if(validation_options)](#validationifvalidation_options)
    - [Example](#example-8)
  - [Validation.arrayNotEmpty(validation_options)](#validationarraynotemptyvalidation_options)
    - [Example](#example-9)
  - [Validation.customSanitizer(validation_options)](#validationcustomsanitizervalidation_options)
    - [Example](#example-10)
  - [Validation.lowercase(validation_options)](#validationlowercasevalidation_options)
    - [Example](#example-11)
  - [Validation.uppercase(validation_options)](#validationuppercasevalidation_options)
    - [Example](#example-12)
  - [Validation.requiredIfNot(validation_options)](#validationrequiredifnotvalidation_options)
    - [Example](#example-13)
  - [Validation.isString(validation_options)](#validationisstringvalidation_options)
    - [Example](#example-14)
  - [Validation.trim(validation_options)](#validationtrimvalidation_options)
    - [Example](#example-15)
  - [Validation.replace(validation_options)](#validationreplacevalidation_options)
    - [Example](#example-16)
  - [Validation.isJwt(validation_options)](#validationisjwtvalidation_options)
    - [Example](#example-17)
  - [Validation.isStrongPassword(validation_options)](#validationisstrongpasswordvalidation_options)
    - [Example](#example-18)
  - [Validation.isEmail(validation_options)](#validationisemailvalidation_options)
    - [Example](#example-19)
  - [Validation.same(validation_options)](#validationsamevalidation_options)
    - [Example](#example-20)
  - [Validation.requiredWith(validation_options)](#validationrequiredwithvalidation_options)
    - [Example](#example-21)
  - [Validation.requiredWithAll(validation_options)](#validationrequiredwithallvalidation_options)
    - [Example](#example-22)
  - [Validation.after(validation_options)](#validationaftervalidation_options)
    - [Example](#example-23)
  - [Validation.afterOrEqual(validation_options)](#validationafterorequalvalidation_options)
    - [Example](#example-24)
  - [Validation.isUUID(validation_options)](#validationisuuidvalidation_options)
    - [Example](#example-25)
  - [Validation.isDate(validation_options)](#validationisdatevalidation_options)
    - [Example](#example-26)
  - [Validation.isValidMongoId(validation_options)](#validationisvalidmongoidvalidation_options)
    - [Example](#example-27)
  - [Validation.unique(validation_options)](#validationuniquevalidation_options)
    - [Example](#example-28)
  - [Validation.requiredWithKeys(validation_options)](#validationrequiredwithkeysvalidation_options)
    - [Example](#example-29)
  - [Validation.exists(validation_options)](#validationexistsvalidation_options)
    - [Example](#example-30)
- [Other](#other)
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
- `bail (Optional)`: If set to true, rest of the validation are skipped if the current one is failed.
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
- `bail (Optional)`: If set to true, rest of the validation are skipped if the current one is failed.
- `checkIn (Optional)`: Specifies the location to check the field (e.g., "body", "query", "params"). Default is 'any'
- `message (Optional)`: Custom error message for the validation failure.
- `params (Optional)`: Params.
  - `strict (Optional)` : Set to true if want strict type check.
  - `allow_leading_zeros (Optional)` : Set to true if want to allow zeros at the starting of number.

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

A function that returns a validation middleware for checking if a field is an array.

`validation_options (Optional)`
- `customFunction (Optional)`: A custom validation function to be executed instead of the default validation.
- `bail (Optional)`: If set to true, rest of the validation are skipped if the current one is failed.
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
- `bail (Optional)`: If set to true, rest of the validation are skipped if the current one is failed.
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

A function that returns a validation middleware for whitelisting values.

`validation_options (Required)`
- `message (Required)`: A custom message.
- `bail (Optional)`: If set to true, rest of the validation are skipped if the current one is failed.
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

## Validation.notIn(validation_options)

A function that returns a validation middleware for blacklisting values.

`validation_options (Required)`
- `message (Required)`: A custom message.
- `bail (Optional)`: If set to true, rest of the validation are skipped if the current one is failed.
- `checkIn (Optional)`: Specifies the location to check the field (e.g., "body", "query", "params"). Default is 'any'
- `params (Required)`: Required params
  - `values (Required)` : Can be string or number or any value.

### Example

```javascript
const { Rule, Validation } = require("typy-js");

const createUserRule = new Rule({
  roleName:[
    Validation.notIn({
      params:{
        values:['Customer']
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

## Validation.rangeOrBetween(validation_options)

A function that returns a validation middleware for defining ranges.

`validation_options (Required)`
- `message (Required)`: A custom message.
- `customFunction (Optional)`: A custom function, which can be defined by user.
- `bail (Optional)`: If set to true, rest of the validation are skipped if the current one is failed.
- `checkIn (Optional)`: Specifies the location to check the field (e.g., "body", "query", "params"). Default is 'any'
- `params (Required)`: Required params
  - `min (Required)` : Can be string or number.
  - `max (Required)` : Can be string or number.
  - `type (Optional)` : Can be string or number or date.

### Example

```javascript
const { Rule, Validation } = require("typy-js");

// With number
const createUserRule = new Rule({
  age:[
    Validation.rangeOrBetween({
      params:{
        min:10,
        max:20,
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

// With date
const checkBirthDateRangeRule = new Rule({
  birthDate:[
    Validation.rangeOrBetween({
      params:{
        min: '2023-01-01',
        max: '2023-12-31',
        type:"date"
      }
    })
  ]
});

// With another field's value
const checkBirthDateRangeRule = new Rule({
  birthDate:[
    Validation.rangeOrBetween({
      params:{
        min: 'allowedDates.min', // uses lodash_.get to get the field value.
        max: 'allowedDates.max', // uses lodash_.get to get the field value.
        type:"field"
      }
    })
  ],
  allowedDates:[
    Validation.required(),
    Validation.isObject(), // see validation.isobject.test.js for more detail
  ],
  "allowedDates.min":[        // Validating nested field
    Validation.required(),
  ],
  "allowedDates.max":[        // Validating nested field
    Validation.required(),
  ],
});

// -----------OR------------
const checkBirthDateRangeRule = new Rule({
  birthDate:[
    Validation.rangeOrBetween({
      params:{
        min: 'allowedDates[0]',
        max: 'allowedDates[1]', 
        type:"field"
      }
    })
  ],
  allowedDates:[
    Validation.required(),
    Validation.isArray({
      params:{
          min:2,
          max:2
      }
    }),
  ],
});
```

## Validation.isObject(validation_options)

A function that returns a validation middleware for checking if the passed value is an Object.

`validation_options (Required)`
- `message (Required)`: A custom message.
- `customFunction (Optional)`: A custom function, which can be defined by user.
- `bail (Optional)`: If set to true, rest of the validation are skipped if the current one is failed.
- `checkIn (Optional)`: Specifies the location to check the field (e.g., "body", "query", "params"). Default is 'any'
- `params (Optional)`: Params
  - `strict (Optional)` : Set to true if wanna strict type type

### Example

```javascript
const { Rule, Validation } = require("typy-js");

const createUser = new Rule({
  user_data:[
    Validation.isObject() // Since this uses express-validator under the hood for detail please vist `https://express-validator.github.io/docs/api/validation-chain/#isobject`
  ],
  "user_data.id":[
    Validation.required(),
    Validation.integer()
  ],
  "user_data.name":[
    Validation.required(),
    Validation.isString() // check validation.isstring.test.js
  ]
});

app.post("/post",
        createUserRule.createValidation(),
        createUserRule.showValidationErrors(), 
        (req,res) => {
    res.json("Successfully Passed All Validation")
});
```

## Validation.if(validation_options)

A function that returns a validation middleware based on condition defined for second Field, or it's value.
This is a complex if validation, check validation.if.test.js for more clarity.

`validation_options (Required)`
- `message (Optional)`: A custom message.
- `customFunction (Optional)`: A custom function, which can be defined by user.
- `bail (Optional)`: If set to true, rest of the validation are skipped if the current one is failed.
- `checkIn (Optional)`: Specifies the location to check the field (e.g., "body", "query", "params"). Default is 'any'
- `params (Required)`: Params
  - `secondField (Required)` : Name of another field.
  - `secondFieldValue (Required)` : The value of other field that should be same.
  - `appliedOnFieldValue (Required)` : The value of the current field ( the field this validation is applied to ).

### Example

```javascript
const { Rule, Validation } = require("typy-js");

const createUserRule = new Rule({
  roleName:[
    Validation.if({ 
      message:"The :attribute field's value must be same as allowName field's value",
      params:{
        secondField:"allowName",
        secondFieldValue:"Admin",
        appliedOnFieldValue:"Admin"
      }
    })
  ],
  allowName:[
    Validation.isString(),
    Validation.in({
      params:{
        values:["Admin"]
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

const createUserRule = new Rule({
  roleName:[
    Validation.if({ // Check's if secondField exists in the payload but the current value is absent.
      message:"The field :attribute must exists if allowName exists",
      params:{
        secondField:"allowName",
        secondFieldValue:"exists",
        appliedOnFieldValue:"exists"
      }
    })
  ],
  allowName:[
    Validation.isString(),
  ]
});

const createUserRule = new Rule({
  roleName:[
    Validation.if({
      message:"The :attribute should not exists if allowName is present in the payload",
      params:{
        secondField:"allowName",
        secondFieldValue:"exists",
        appliedOnFieldValue:"notexists"
      }
    })
  ],
  allowName:[
    Validation.isString(),
  ]
});
```

## Validation.arrayNotEmpty(validation_options)

A function that returns a validation middleware that checks if the array is empty or not

`validation_options (Optional)`
- `message (Optional)`: A custom message.
- `customFunction (Optional)`: A custom function, which can be defined by user.
- `bail (Optional)`: If set to true, rest of the validation are skipped if the current one is failed.
- `checkIn (Optional)`: Specifies the location to check the field (e.g., "body", "query", "params"). Default is 'any'

### Example

```javascript
const { Rule, Validation } = require("typy-js");

const createUserRule = new Rule({
  skills:[
    Validation.arrayNotEmpty({
      message:"The array can not be empty"
    })
  ],
  "skills.*":[            // To validate every element in the array use "<field>.*"
    Validation.isString()
  ]
});

app.post("/post",
        createUserRule.createValidation(),
        createUserRule.showValidationErrors(), 
        (req,res) => {
    res.json("Successfully Passed All Validation")
});
```

## Validation.customSanitizer(validation_options)

A function that returns a sanitizer middleware function defined by user.

`validation_options (Required)`
- `customFunction (Required)`: A custom function, which can be defined by user.
- `bail (Optional)`: If set to true, rest of the validation are skipped if the current one is failed.
- `checkIn (Optional)`: Specifies the location to check the field (e.g., "body", "query", "params"). Default is 'any'

### Example

```javascript
const { Rule, Validation } = require("typy-js");

const createUserRule = new Rule({
  name:[
    Validation.customSanitizer({
      customFunction:(({ value, reqObject, field }) => {
        return value.toLowerCase();
      })
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

## Validation.lowercase(validation_options)

A function that returns a sanitizer middleware to set string value as lowercase.

`validation_options (Optional)`
- `bail (Optional)`: If set to true, rest of the validation are skipped if the current one is failed.
- `checkIn (Optional)`: Specifies the location to check the field (e.g., "body", "query", "params"). Default is 'any'

### Example

```javascript
const { Rule, Validation } = require("typy-js");

const createUserRule = new Rule({
  name:[
    Validation.lowerCase()
  ]
});

app.post("/post",
        createUserRule.createValidation(),
        createUserRule.showValidationErrors(), 
        (req,res) => {
    res.json("Successfully Passed All Validation")
});
```

## Validation.uppercase(validation_options)

A function that returns a sanitizer middleware to set string value as uppercase.

`validation_options (Optional)`
- `bail (Optional)`: If set to true, rest of the validation are skipped if the current one is failed.
- `checkIn (Optional)`: Specifies the location to check the field (e.g., "body", "query", "params"). Default is 'any'

### Example

```javascript
const { Rule, Validation } = require("typy-js");

const createUserRule = new Rule({
  name:[
    Validation.upperCase()
  ]
});

app.post("/post",
        createUserRule.createValidation(),
        createUserRule.showValidationErrors(), 
        (req,res) => {
    res.json("Successfully Passed All Validation")
});
```

## Validation.requiredIfNot(validation_options)

A function that returns a validation middleware that makes a field required if the condition does not meet.

`validation_options (Required)`
- `message (Optional)`: A custom message.
- `customFunction (Optional)`: A custom function, which can be defined by user.
- `bail (Optional)`: If set to true, rest of the validation are skipped if the current one is failed.
- `checkIn (Optional)`: Specifies the location to check the field (e.g., "body", "query", "params"). Default is 'any'
- `params (Required)`: Params
  - `secondField (Required)` : Name of another field.
  - `secondFieldValue (Required)` : The value of other field.

### Example

```javascript
const { Rule, Validation } = require("typy-js");

const createUserRule = new Rule({
  username:[
    Validation.requiredIfNot({
      message:"The :attribute is required if email is not equal to testuser@gmail.com",
      params:{
        secondField:"email",
        secondFieldValue:"testuser@gmail.com"
      }
    }),
  ],
  email:[
    Validation.required(),
    Validation.isString()
  ]
});


app.post("/post",
        createUserRule.createValidation(),
        createUserRule.showValidationErrors(), 
        (req,res) => {
    res.json("Successfully Passed All Validation")
});
```

## Validation.isString(validation_options)

A function that returns a validation middleware to check if the current field's value is type of string.

`validation_options (Optional)`
- `message (Optional)`: A custom message.
- `bail (Optional)`: If set to true, rest of the validation are skipped if the current one is failed.
- `checkIn (Optional)`: Specifies the location to check the field (e.g., "body", "query", "params"). Default is 'any'
- `params (Optional)`: Params
  - `min (Optional)` : Minimum number of characters.
  - `max (Optional)` : Maximum number of characters.

### Example

```javascript
const { Rule, Validation } = require("typy-js");

// Without any params
const createUserRule = new Rule({
  name:[
    Validation.isString({
      message:"The :attribute must be of type string"
    })
  ]
});


app.post("/post",
        createUserRule.createValidation(),
        createUserRule.showValidationErrors(), 
        (req,res) => {
    res.json("Successfully Passed All Validation")
});

// With min and max params
const createUserRule = new Rule({
  name:[
    Validation.isString({
      message:"The :attribute must be of type string and must have :min and :max string length",
      params:{
        min:5,
        max:10
      }
    })
  ]
});
```

## Validation.trim(validation_options)

A function that returns a validation middleware that trims the string.

`validation_options (Required)`
- `bail (Optional)`: If set to true, rest of the validation are skipped if the current one is failed.
- `checkIn (Optional)`: Specifies the location to check the field (e.g., "body", "query", "params"). Default is 'any'
- `params (Required)`: Params
  - `chars (Required)` : Pattern to match. ( eg : " ", "@" )

### Example

```javascript
const { Rule, Validation } = require("typy-js");

const createUserRule = new Rule({
  name:[
    Validation.trim({
      params: {
        chars:" "
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

const createUserRule = new Rule({
  name:[
    Validation.trim({
      params: {
        chars:"$$"
      }
    })
  ]
});
```

## Validation.replace(validation_options)

A function that returns a validation middleware that replaces the string.

`validation_options (Required)`
- `bail (Optional)`: If set to true, rest of the validation are skipped if the current one is failed.
- `checkIn (Optional)`: Specifies the location to check the field (e.g., "body", "query", "params"). Default is 'any'
- `params (Required)`: Params
  - `new_value (Required)` : A string value
  - `value_to_replace (Required)` : Can be a string or a regex pattern

### Example

```javascript
const { Rule, Validation } = require("typy-js");

const createUserRule = new Rule({
  name:[
    Validation.replace({
      params:{
        new_value:"Hello!",
        value_to_replace:"greetings"
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

const createUserRule = new Rule({
  name:[
    Validation.replace({
      params:{
        new_value:"Hello!",
        value_to_replace:/greeting/ig
      }
    })
  ]
});
```

## Validation.isJwt(validation_options)

A function that returns a validation middleware that checks if the string is a valid JWT Token.
It only matches the pattern, to verify the jwt token please use packages like bcrypt-js.

`validation_options (Optional)`
- `bail (Optional)`: If set to true, rest of the validation are skipped if the current one is failed.
- `checkIn (Optional)`: Specifies the location to check the field (e.g., "body", "query", "params"). Default is 'any'
- `message (Optional)` : Any custom message on failure.

### Example

```javascript
const { Rule, Validation } = require("typy-js");

const createPostRule = new Rule({
  authorization:[
    Validation.isJwt({
      checkIn:"header",
      message:"The :attribute's value is not a valid jwt token"
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

## Validation.isStrongPassword(validation_options)

A function that returns a validation middleware that checks if the string is a strong password.

`validation_options (Optional)`
- `bail (Optional)`: If set to true, rest of the validation are skipped if the current one is failed.
- `checkIn (Optional)`: Specifies the location to check the field (e.g., "body", "query", "params"). Default is 'any'
- `message (Optional)` : Any custom message on failure.
- `params (Optional)` : Params
  - `pattern (Optional)` : A Regex pattern to match.

### Example

```javascript
const { Rule, Validation } = require("typy-js");

const createUserRule = new Rule({
  password:[
    Validation.isStrongPassword()
  ]
});

app.post("/post",
        createUserRule.createValidation(),
        createUserRule.showValidationErrors(), 
        (req,res) => {
    res.json("Successfully Passed All Validation")
});
```

## Validation.isEmail(validation_options)

A function that returns a validation middleware that checks if the string is a valid email address.

`validation_options (Optional)`
- `bail (Optional)`: If set to true, rest of the validation are skipped if the current one is failed.
- `checkIn (Optional)`: Specifies the location to check the field (e.g., "body", "query", "params"). Default is 'any'
- `message (Optional)` : Any custom message on failure.
- `params (Optional)` : Params
  - `pattern (Optional)` : A Regex pattern to match.

### Example

```javascript
const { Rule, Validation } = require("typy-js");

const createUserRule = new Rule({
  email:[
    Validation.isEmail()
  ]
});

app.post("/post",
        createUserRule.createValidation(),
        createUserRule.showValidationErrors(), 
        (req,res) => {
    res.json("Successfully Passed All Validation")
});
```

## Validation.same(validation_options)

A function that returns a validation middleware that checks if the one field value is same as another field value.

`validation_options (Required)`
- `bail (Optional)`: If set to true, rest of the validation are skipped if the current one is failed.
- `checkIn (Optional)`: Specifies the location to check the field (e.g., "body", "query", "params"). Default is 'any'
- `message (Optional)` : Any custom message on failure.
- `params (Required)` : Params
  - `negate (Required)` : Set to true is want to reverse the validation logic.
  - `otherField (Required)` : The other field to match with.

### Example

```javascript
const { Rule, Validation } = require("typy-js");

const createUserRule = new Rule({
  password:[
    Validation.same({
      params:{
        otherField: "confirmPassword"
      }
    }),
    Validation.same({
      message:"The :attribute's value must not be same as temporaryPassword's value",
      params: {
        negate:true, // This reverse the validation check, password must not be same as temporary password
        otherField:"temporaryPassword"
      }
    })
  ],
  confirmPassword:[
    Validation.isString()
  ],
  temporaryPassword:[
    Validation.isString()
  ]
});

app.post("/post",
        createUserRule.createValidation(),
        createUserRule.showValidationErrors(), 
        (req,res) => {
    res.json("Successfully Passed All Validation")
});
```

## Validation.requiredWith(validation_options)

A function that returns a validation middleware that checks the field that must be required with its peers.

`validation_options (Required)`
- `bail (Optional)`: If set to true, rest of the validation are skipped if the current one is failed.
- `checkIn (Optional)`: Specifies the location to check the field (e.g., "body", "query", "params"). Default is 'any'
- `message (Optional)` : Any custom message on failure.
- `params (Required)` : Params
  - `fields (Required)` : Name of the fields to pair with.

### Example

```javascript
const { Rule, Validation } = require("typy-js");

const createUserRule = new Rule({
  first_name:[
    Validation.requiredWith({
      params :{
        fields:["last_name","middle_name"]
      }
    })
  ],
  last_name:[
    Validation.isString()
  ],
  middle_name:[
    Validation.isString()
  ]
});

app.post("/post",
        createUserRule.createValidation(),
        createUserRule.showValidationErrors(), 
        (req,res) => {
    res.json("Successfully Passed All Validation")
});
```

## Validation.requiredWithAll(validation_options)

A function that returns a validation middleware that checks the field that must be required with all of its peers.

`validation_options (Required)`
- `bail (Optional)`: If set to true, rest of the validation are skipped if the current one is failed.
- `checkIn (Optional)`: Specifies the location to check the field (e.g., "body", "query", "params"). Default is 'any'
- `message (Optional)` : Any custom message on failure.
- `params (Required)` : Params
  - `fields (Required)` : Name of the fields to pair with.

### Example

```javascript
const { Rule, Validation } = require("typy-js");

const createUserRule = new Rule({
  first_name:[
    Validation.requiredWithAll({
      params :{
        fields:["last_name","middle_name"]
      }
    })
  ],
  last_name:[
    Validation.isString()
  ],
  middle_name:[
    Validation.isString()
  ]
});

app.post("/post",
        createUserRule.createValidation(),
        createUserRule.showValidationErrors(), 
        (req,res) => {
    res.json("Successfully Passed All Validation")
});
```

## Validation.after(validation_options)

A function that returns a validation middleware that checks if the date is after an specified date.

`validation_options (Required)`
- `bail (Optional)`: If set to true, rest of the validation are skipped if the current one is failed.
- `checkIn (Optional)`: Specifies the location to check the field (e.g., "body", "query", "params"). Default is 'any'
- `message (Optional)` : Any custom message on failure.
- `params (Required)` : Params
  - `date (Required)` : A valid date in string format, (eg : "2023-05-03" ). You can also pass another field name too.
    - See `validation.after.test.js` for more detail.

### Example

```javascript
const { Rule, Validation } = require("typy-js");

const createProductRule = new Rule({
  expire_date:[
    Validation.after({
      params : {
        date: "today"
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

## Validation.afterOrEqual(validation_options)

A function that returns a validation middleware that checks if the date is after or equal to a specified date.

`validation_options (Required)`
- `bail (Optional)`: If set to true, rest of the validation are skipped if the current one is failed.
- `checkIn (Optional)`: Specifies the location to check the field (e.g., "body", "query", "params"). Default is 'any'
- `message (Optional)` : Any custom message on failure.
- `params (Required)` : Params
  - `date (Required)` : A valid date in string format, (eg : "2023-05-03" ). You can also pass another field name too.
    - See `validation.afterorequal.test.js` for more detail.

### Example

```javascript
const { Rule, Validation } = require("typy-js");

const createProductRule = new Rule({
  expire_date:[
    Validation.afterOrEqual({
      params : {
        date: "today"
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

## Validation.isUUID(validation_options)

A function that returns a validation middleware that checks if the date is after or equal to a specified date.

`validation_options (Required)`
- `bail (Optional)`: If set to true, rest of the validation are skipped if the current one is failed.
- `checkIn (Optional)`: Specifies the location to check the field (e.g., "body", "query", "params"). Default is 'any'
- `message (Optional)` : Any custom message on failure.
- `params (Required)` : Params
  - `version (Required)` : A valid UUID version

### Example

```javascript
const { Rule, Validation } = require("typy-js");

const createUser = new Rule({
  user_id:[
    Validation.isUUID({
      params:{
        version:"all"
      }
    })
  ],
});

app.post("/post",
        createUserRule.createValidation(),
        createUserRule.showValidationErrors(), 
        (req,res) => {
    res.json("Successfully Passed All Validation")
});
```

## Validation.isDate(validation_options)

A function that returns a validation middleware that checks if provided value is a valid date.

`validation_options (Optional)`
- `bail (Optional)`: If set to true, rest of the validation are skipped if the current one is failed.
- `checkIn (Optional)`: Specifies the location to check the field (e.g., "body", "query", "params"). Default is 'any'
- `message (Optional)` : Any custom message on failure.
- `params (Optional)` : Params
  - `format (Optional)` : Date format, if not passed params then default is 'YYYY-MM-DD'.
  - `delimiters (Optional)` : It is an array of allowed date delimiters, if not passed params then defaults to ['/', '-'].
  - `strictMode (Optional)` : If strictMode is set to true, the validator will reject strings different from format.

### Example

```javascript
const { Rule, Validation } = require("typy-js");

const createUser = new Rule({
  dateOfBirth:[
    Validation.isDate({
      params : {
        format:"YYYY/MM/DD",
        delimiters:["-","/"]
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

## Validation.isValidMongoId(validation_options)

A function that returns a validation middleware that checks if provided value is a valid mongo Id.

`validation_options (Optional)`
- `bail (Optional)`: If set to true, rest of the validation are skipped if the current one is failed.
- `checkIn (Optional)`: Specifies the location to check the field (e.g., "body", "query", "params"). Default is 'any'
- `message (Optional)` : Any custom message on failure.

### Example

```javascript
const { Rule, Validation } = require("typy-js");

const createUser = new Rule({
  user_id:[
    Validation.isValidMongoId()
  ],
});

app.post("/post",
        createUserRule.createValidation(),
        createUserRule.showValidationErrors(), 
        (req,res) => {
    res.json("Successfully Passed All Validation")
});
```

## Validation.unique(validation_options)

A function that returns a validation middleware that checks if array has unique values.

`validation_options (Optional)`
- `bail (Optional)`: If set to true, rest of the validation are skipped if the current one is failed.
- `checkIn (Optional)`: Specifies the location to check the field (e.g., "body", "query", "params"). Default is 'any'
- `message (Optional)` : Any custom message on failure.

### Example

```javascript
const { Rule, Validation } = require("typy-js");

const createUserRule = new Rule({
  hobbies:[
    Validation.unique()
  ],
});

app.post("/post",
        createUserRule.createValidation(),
        createUserRule.showValidationErrors(), 
        (req,res) => {
    res.json("Successfully Passed All Validation")
});
```

## Validation.requiredWithKeys(validation_options)

A function that returns a validation middleware that checks if array has required keys.

`validation_options (Required)`
- `bail (Optional)`: If set to true, rest of the validation are skipped if the current one is failed.
- `checkIn (Optional)`: Specifies the location to check the field (e.g., "body", "query", "params"). Default is 'any'
- `message (Optional)` : Any custom message on failure.
- `params (Required)` : Params
  - `keys (Required)` : Array of string

### Example

```javascript
const { Rule, Validation } = require("typy-js");

// Use this with isArray({ bail:true }), use this as first validation element
// Set bail true, so that if the field is not an array it will not further validate
// Which can avoid unnecessary errors
const createUserRule = new Rule({
  designations:[
    Validation.isArray({
      bail:true
    }),
    Validation.requiredWithKeys({
      params :{
        keys: ["id","name"]
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


## Validation.exists(validation_options)

A function that returns a validation middleware that checks if certain value exists in the database.

`validation_options (Required)`
- `bail (Optional)`: If set to true, rest of the validation are skipped if the current one is failed.
- `checkIn (Optional)`: Specifies the location to check the field (e.g., "body", "query", "params"). Default is 'any'
- `message (Optional)` : Any custom message on failure.
- `params (Required)` : Params
  - `dbConnection (Required)` : Mysql DB connection or PG client is supported.
  - `dialect (Required)` : Available values are `'mysql','pg'`
  - `negate (Optional)` : Set to true if you want to negate the condition.
  - `tableName (Required)`: Name of the table to check in.
  - `columnToCheckAgainst (Required)` : Name of the column to check against the value.

### Example

```javascript
const { Rule, Validation } = require("typy-js");

const { Client } = require("pg");

const pgClient = new Client({
  host:"localhost",
  port:5432,
  user:"postgres",
  password:"123456789",
  database:"postgres"
})

await pgClient.connect();

const createPost = new Rule({
  id:[
    Validation.exists({
      params:{
        dbConnection:pgClient,
        dialect:"pg",
        tableName:"users", // Table Name
        columnToCheckAgainst:"id" // Column in the table
      }
    }),
  ]
});

app.post("/post",
        createPost.createValidation(),
        createPost.showValidationErrors(), 
        (req,res) => {
    res.json("Successfully Passed All Validation")
});
```

# Other
Some other features that comes with this package are following. See `validation.other.test.js`
- Custom Validation Error Response.
- `bail` key to prevent validation from keep checking if current validation fails.


# License
MIT
