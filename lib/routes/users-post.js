'use strict';
const router = require('express').Router();
const logger = require('../logger');
const {User, UserInformation} = require('../models');
const { schemaUser } = require('../validation/joi-validation');

function validateFields(req, res, next) {
    // TODO:
    // - name: string, al menos 3 caracteres
    // - color: string, uno de estos valores: "red", "green", "blue"
    // - email: string
    // - name: String
    // Ver los campos que son requeridos

    UserInformation.findOne({dni: req.body.dni}).then(existingUserInfo => {
        if(!existingUserInfo) {
            const { error } = schemaUser.validate( req.body, {abortEarly: false})
            if(error) {
                return res.status(400).json({
                    code: 'validation_error',
                    message: 'Validation failed',
                    details: error.details.map(detail => detail.message)
                });
            }
            return next();
        }

        return res.status(400).json({
            code: 'duplicate_dni',
            message: `Un user ya cuenta con este dni ${req.body.dni}`
        });
    })

    
}

function createUserInformation(req, res, next) {
    const { name, lastName, dni, age } = req.body;

    return UserInformation.create({
        name: name.toLowerCase(),
        lastName: lastName.toLowerCase(),
        dni,
        age,
    }).then((userInfo) => {
        req.userInfoId = userInfo._id;
        next();
    }).catch((error) => {
        logger.error(`POST /users - createUserInformation error: ${error.message}`);
        return res.status(500).json({
            code: 'internal_error',
            message: 'Internal error'
        });
    });
}

function saveUser(req, res) {
    // TODO: crear user con todos los campos correctos
    return User.create({
        name: req.body.name,
        color: req.body.color,
        email: req.body.email,
        userInformation: req.userInfoId
    })
        .then((user) => {
            return res.status(201).json(user.toJSON());
        })
        .catch((error) => {
            logger.error(`POST /users - saveUser error: ${error.message}`);
            return res.status(500).json({
                code: 'internal_error',
                message: 'Internal error'
            });
        }); 
}

function disableUser(req, res){
    return User.findById(req.params.id).then(user => {
        if(!user){
            return res.status(400).json({ error: 'Usuario no encontrado' });
        }
        if(!user.enabled){
            return res.status(400).json({ error: 'El usuario ya está deshabilitado' });
        }
        user.enabled = false;
        return user.save().then()
    }).then(() => {
        res.status(200).json({ message: 'Usuario deshabilitado correctamente' });
    }).catch((error) => {
        logger.error(`POST /users - disableUser error: ${error.message}`);
        return res.status(500).json({
            code: 'internal_error',
            message: 'Internal error'
        });
    }); 
}

router.post(
    '/users',
    validateFields,
    createUserInformation,
    saveUser
);

router.post(
    '/users/:id/disable', 
    disableUser
)

module.exports = router;
