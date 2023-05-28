const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended:true }));

const setRoute = (method = 'get', routePath = '/get-data' ,middleware, returnPayload = false, customFunctionToShowValidation = null) => {

    app[method](routePath,middleware.createValidation(), middleware.showValidationErrors(customFunctionToShowValidation),(req,res) => {

        const payload = req.body || req.params || req.query;

        return res.status(200).json(returnPayload ? payload : {
            message:"Success"
        })
    });

}

module.exports = {
    app,
    setRoute
}
