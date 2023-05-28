const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended:true }));

const setRoute = (method = 'get', routePath = '/get-data' ,middleware, returnPayload = false) => {
    app[method](routePath,middleware.createValidation(), middleware.showValidationErrors(),(req,res) => {

        const payload = req.body || req.params || req.query;

        return res.status(200).json(returnPayload ? payload : {
            message:"Success"
        })
    })
}

module.exports = {
    app,
    setRoute
}
