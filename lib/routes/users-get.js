"use strict";
const router = require("express").Router();
const logger = require("../logger");
const { User } = require("../models");

function getUsers(req, res) {
    const { enabled, sortBy } = req.query;

    let filter = {};
    if (enabled !== undefined) {
        filter.enabled = enabled === "true";
    }

    let sortOption = {};

    if (sortBy) {
        if (sortBy.startsWith('userInformation.')) {
            const order = sortBy.startsWith('-') ? -1 : 1;
            const field = sortBy.startsWith('-') ? sortBy.slice(1) : sortBy;
            sortOption[field] = order;
        } else {
            const order = sortBy.startsWith('-') ? -1 : 1;
            const field = sortBy.startsWith('-') ? sortBy.slice(1) : sortBy;
            sortOption[field] = order;
        }
    }

    User.find(filter)
        .sort(sortOption)
        .populate('userInformation')
        .then(users => {
            if (sortBy) {
                const order = sortBy.startsWith('-') ? -1 : 1;
                const field = sortBy.startsWith('-') ? sortBy.slice(1) : sortBy;
                users.sort((a, b) => {
                    const aValue = field.split('.').reduce((obj, key) => obj && obj[key], a);
                    const bValue = field.split('.').reduce((obj, key) => obj && obj[key], b);

                    if (aValue < bValue) return -1 * order;
                    if (aValue > bValue) return 1 * order;
                    return 0;
                });
            }
            res.status(200).json(users);
        })
        .catch(error => {
            logger.error(`GET /users - getUsers error: ${error.message}`);
            return res.status(500).json({
                code: "internal_error",
                message: "Internal error",
            });
        });
}

router.get("/users", getUsers);

module.exports = router;
