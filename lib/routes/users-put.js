"use strict";
const router = require("express").Router();
const logger = require("../logger");
const { User, UserInformation } = require("../models");
const { schemaUser } = require("../validation/joi-validation");

function validateFields(req, res, next) {
    const { error } = schemaUser.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({
            code: "validation_error",
            message: "Validation failed",
            details: error.details.map((detail) => detail.message),
        });
    }
    return next();
}

function updateUser(req, res, next) {
    return User.findById(req.params.id)
        .then((user) => {
            if (!user) {
                return res.status(400).json({ error: "Usuario no encontrado" });
            }
            user.color = req.body.color;
            user.email = req.body.email;

            user.save()
                .then((result) => {
                    req.user = result;
                    next();
                })
                .catch((error) => {
                    logger.error(
                        `PUT /users - updateUser error: ${error.message}`
                    );
                    return res.status(500).json({
                        code: "internal_error",
                        message: "Internal error",
                        lugar: "40",
                    });
                });
        })
        .catch((error) => {
            logger.error(`PUT /users - updateUser error: ${error.message}`);
            return res.status(500).json({
                code: "internal_error",
                message: "Internal error",
            });
        });
}

function updateUserInformation(req, res) {
    return UserInformation.findById(req.user.userInformation)
        .then((userInfo) => {
            if (!userInfo) {
                return res
                    .status(400)
                    .json({ error: "Informacion del Usuario no encontrado" });
            }

            userInfo.name = req.body.name;
            userInfo.lastName = req.body.lastName;
            userInfo.dni = req.body.dni;
            userInfo.age = req.body.age;

            userInfo
                .save()
                .then((result) => {
                    const user = req.user;
                    user.userInformation = result;
                    res.status(201).json(user);
                })
                .catch((error) => {
                    logger.error(
                        `PUT /users - updateUser error: ${error.message}`
                    );
                    return res.status(500).json({
                        code: "internal_error",
                        message: "Internal error",
                    });
                });
        })
        .catch((error) => {
            logger.error(`PUT /users - updateUser error: ${error.message}`);
            return res.status(500).json({
                code: "internal_error",
                message: "Internal error",
            });
        });
}

router.put("/users/:id", validateFields, updateUser, updateUserInformation);

module.exports = router;
