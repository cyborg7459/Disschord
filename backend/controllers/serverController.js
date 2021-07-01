const appError = require('../utils/appError');
const Server = require('../models/serverModel');

exports.checkServerExistence = async (req, res, next) => {
    try {
        const server = await Server.findOne({ slug : req.params.slug });
        if(!server) return next(new appError('No server found with that name', 404));
        req.server = server;
        next();
    }
    catch (err) {
        next(err);
    }
}

exports.checkServerOwnership = async (req, res, next) => {
    try { 
        if(!req.server.owner._id.equals(req.user._id)) return next(new appError('You are not authorized for this action', 403));
        next();
    }
    catch {
        return next(err);
    }
}

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
        const newServer = await Server.create({
            name: req.body.name,
            isPrivate: req.body.isPrivate,
            description: req.body.description,
            owner: req.user._id
        })

        newServer.admins.push(req.user._id);
        newServer.members.push(req.user._id);
        
        req.user.servers.push(newServer._id);
        await newServer.save();
        await req.user.save();

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

exports.updateServerDetails = async (req, res, next) => {
    try {

    }
    catch(err) {

    }
}

exports.getSingleServer = async (req, res, next) => {
    try {
        const curUser = req.user._id;
        if(!req.server.admins.find(admin => admin._id.equals(curUser))) {
            req.server.pendingRequests = undefined
        }
        res.status(200).json({
            status: 'success',
            data: {
                server : req.server
            }
        })
    }
    catch(err) {
        return next(err);
    }
}

exports.deleteServer = async (req, res, next) => {
    try {
        await Server.findByIdAndDelete(req.server._id);
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

exports.deleteJoinRequest = async (req, res, next) => {
    try {
        const server = await Server.findOne({ slug : req.params.slug });
        if(!server) return next(new appError('Server not found', 404));

        const request = server.pendingRequests.find(request => request._id.equals(req.params.id));
        if(!request) return next(new appError('Request not found', 404));

        if(!request._id.equals(req.user._id) && !server.admins.find(admin => admin._id.equals(req.user._id))) return next(new appError('You are not authorized for this action', 403));

        server.pendingRequests = server.pendingRequests.filter(request => !request._id.equals(req.params.id));
        await server.save();

        res.status(200).json({
            status: 'Success',
            message: 'Request deleted successfully'
        })
    }
    catch(err) {
        return next(err);
    }
}

exports.acceptJoinRequest = async (req, res, next) => {
    try {
        const server = await Server.findOne({ slug : req.params.slug });
        if(!server) return next(new appError('Server not found', 404));

        const curRequest = server.pendingRequests.find(request => request._id.equals(req.params.id));
        if(!curRequest) return next(new appError('Request not found', 404));

        if(!server.admins.find(admin => admin._id.equals(req.user._id))) return next(new appError('You are not authorized for this action', 403));

        server.pendingRequests = server.pendingRequests.filter(request => !request._id.equals(req.params.id));
        server.members.push(req.params.id);
        await server.save();

        res.status(200).json({
            status: 'success',
            message: 'request accepted'
        })
    }
    catch(err) {
        return next(err);
    }
}

exports.makeAdmin = async (req, res, next) => {
    try {        
        const userToAdd = req.server.members.find(member => member._id.equals(req.params.id));
        if(!userToAdd) return next(new appError('User is not member of server', 404));

        req.server.admins.push(req.params.id);
        await req.server.save();

        res.status(200).json({
            status: 'success',
            message: 'added admin'
        })
    }
    catch(err) {
        return next(err);
    }
}

exports.removeFromAdmin = async (req, res, next) => {
    try {
        const server = await Server.findOne({ slug : req.params.slug });
        if(!server) return next(new appError('Server not found', 404));

        const adminToRemove = server.admins.find(admin => admin._id.equals(req.params.id));
        if(!adminToRemove) return next(new appError('No admin with this ID', 404));

        if(!server.owner._id.equals(req.user._id)) return next(new appError('You are not authorized to perform this action'));

        server.admins = server.admins.filter(admin => !admin._id.equals(req.params.id));
        await server.save();

        res.status(200).json({
            status: 'success',
            message: 'removed admin'
        })
    }
    catch(err) {
        return next(err);
    }
}