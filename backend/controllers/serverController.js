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

        newServer.admins.push(req.user._id);
        newServer.members.push(req.user._id);

        await newServer.save();

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
        let server = await Server.findOne({ slug: req.params.slug });
        if(!server) return next(new appError('No server found with that name', 404));
        const curUser = req.user._id;
        if(!server.admins.find(admin => admin._id.equals(curUser))) {
            console.log("Hel");
            server.pendingRequests = undefined
        }
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
        const server = await Server.findOne({ slug : req.params.slug });
        if(!server) return next(new appError('No server found with that name', 404));
        if(!server.owner._id.equals(req.user._id)) return next(new appError('You are not authorized to delete the server belonging to someone else', 403));

        await Server.findByIdAndDelete(server._id);

        res.status(204).json({
            status: 'success',
            data: {}
        })
    }
    catch(err) {
        return next(err);
    }
}

exports.sendRequestToJoin = async (req, res, next) => {
    try {
        const server = await Server.findOne({ slug : req.params.slug });
        if(!server.isPrivate) return next(new appError('Can\'t send joining request to a public server', 500));
        const requestID = req.user._id;
        const user = server.members.find(member => member._id.equals(requestID));
        if(user) return next(new appError('You are already a member', 500));

        server.pendingRequests.push(requestID);
        await server.save();

        res.status(202).json({
            status: 'success',
            message: 'Joining request sent'
        });
    }
    catch(err) {
        return next(err);
    }
}

exports.getPendingRequests = async (req, res, next) => {
    try {
        const server = await Server.findOne({ slug : req.params.slug });
        const userID = req.user._id;
        if(!server.admins.find(admin => admin._id.equals(userID))) return next(new appError('You are not authorized to view the pending requests', 403));
        const requests = {
            count: server.pendingRequests.length,
            requests: server.pendingRequests
        }
        res.status(200).json({
            status: 'success',
            data: {
                requests
            }
        })
    }
    catch(err) {
        return next(err);
    }
}