const appError = require('../utils/appError');
const Server = require('../models/serverModel');

exports.getAllServers = async (req, res, next) => {
    try {
        const servers = await Server.find({});
        res.status(200).json({
            status: 'Success',
            results: servers.length,
            data: {
                servers
            }
        })
    }
    catch(err) {
        return next(err);
    }
}

exports.createNewServer = async (req, res, next) => {
    try {
        console.log(req.body);
        const newServer = await Server.create({
            name: req.body.name,
            isPrivate: req.body.isPrivate,
            description: req.body.description,
            owner: req.user._id
        })
        res.status(201).json({
            status: 'Success',
            data: {
                server: newServer
            }
        })
    }
    catch(err) {
        return next(err);
    }
}

exports.getSingleServer = async (req, res, next) => {
    try {
        const server = await Server.findById(req.params.id);
        res.status(200).json({
            status: 'success',
            data: {
                server
            }
        })
    }
    catch(err) {
        return next(err);
    }
}

exports.deleteServer = async (req, res, next) => {
    try {
        console.log(req.params);
        const server = await Server.findByIdAndDelete(req.params.id);
        if(!server) return next(new appError('No record found with that ID', 404));
        res.status(204).json({
            status: 'success',
            data: {}
        })
    }
    catch(err) {
        return next(err);
    }
}