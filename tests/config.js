const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended:true }));

const setRoute = (method = 'get', routePath = '/get-data' ,middleware) => {
    app[method](routePath,middleware.createValidation(), middleware.showValidationErrors(),(req,res) => {
        return res.status(200).json({
            message : "Passed"
        })
    })
}

module.exports = {
    app,
    setRoute
}
