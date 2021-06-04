"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
//import * as path from 'path';
const express = require("express");
const logger = require("morgan");
//import * as mongodb from 'mongodb';
//import * as url from 'url';
const bodyParser = require("body-parser");
const UserModel_1 = require("./model/UserModel");
const MemeModel_1 = require("./model/MemeModel");
const CommentModel_1 = require("./model/CommentModel");
const VoteModel_1 = require("./model/VoteModel");
// Creates and configures an ExpressJS web server.
class App {
    //Run configuration methods on the Express instance.
    constructor() {
        this.expressApp = express();
        this.middleware();
        this.routes();
        this.idGenerator = 102;
        //added these
        this.User = new UserModel_1.UserModel();
        this.Comment = new CommentModel_1.CommentModel();
        this.Meme = new MemeModel_1.MemeModel();
        this.Vote = new VoteModel_1.VoteModel();
    }
    // Configure Express middleware.
    middleware() {
        this.expressApp.use(logger("dev"));
        this.expressApp.use(bodyParser.json());
        this.expressApp.use(bodyParser.urlencoded({ extended: false }));
    }
    // Configure API endpoints.
    routes() {
        let router = express.Router();
        //What do we need
        /*
        Create User
        Get User
        Authentication
        Create Post
        Get Post
        Delete Post
        Upvote
        Downvote
        get feed
        create comment
        update comment
        delete comment
        */
        // #################################################
        // ##############  USERS METHODS    ################
        // #################################################
        //Create User
        router.post("/app/users/", (req, res) => {
            this.User.createUser(res, req.body);
        });
        //Get User Details
        router.get("/app/users/:userId/", (req, res) => __awaiter(this, void 0, void 0, function* () {
            this.User.retrieveUserDetails(res, { userId: req.params.userId });
        }));
        router.put("/app/users/", (req, res) => {
            this.User.updateUserDetails(res, req.body);
        });
        router.delete("/app/users/", (req, res) => {
            this.User.deleteUser(res, req.body);
            this.Meme.deleteMeme(res, { userId: req.body["userId"] });
            this.Comment.deleteComment(res, { commentId: req.body["userId"] });
        });
        // #################################################
        // ##############  memes METHODS    ################
        // #################################################
        //create a post
        router.post("/app/memes/", (req, res) => {
            this.Meme.createPost(res, req.body);
        });
        //get individual post details by id
        router.get("/app/memes/:memeId/", (req, res) => __awaiter(this, void 0, void 0, function* () {
            this.Meme.retrieveMemeDetails(res, { memeId: req.params.memeId });
        }));
        //load feed (get post by day)
        router.get("/app/memes/day/:day", (req, res) => {
            this.Meme.getFeed(res, { timePost: new Date(req.params.day) });
        });
        router.put("/app/memes/", (req, res) => {
            this.Meme.updatePostDetails(res, req.body);
        });
        router.delete("/app/memes/", (req, res) => {
            this.Meme.deleteMeme(res, req.body);
            this.Comment.deleteComment(res, { commentId: req.body["memeId"] });
        });
        // #################################################
        // ##############  COMMENT METHODS    ################
        // #################################################
        router.post("/app/comments/", (req, res) => {
            this.Comment.createComment(res, req.body);
        });
        router.get("/app/comments/:commentId", (req, res) => __awaiter(this, void 0, void 0, function* () {
            this.Comment.retrieveComment(res, { commentId: req.params.commentId });
        }));
        //get all comments on a post
        router.get("/app/memes/comment/:memeId", (req, res) => __awaiter(this, void 0, void 0, function* () {
            this.Comment.retrieveComments(res, { memeId: req.params.memeId });
            // this.Comment.retrieveComment(res, req.body as ICommentModel);
        }));
        router.put("/app/memes/comments/", (req, res) => {
            this.Comment.updateComment(res, req.body);
        });
        router.delete("/app/memes/comments/", (req, res) => {
            this.Comment.deleteComment(res, req.body);
        });
        // #################################################
        // ##############  VOTE METHODS    #################
        // #################################################
        router.post("/app/memes/votes/", (req, res) => {
            this.Vote.createVote(res, req.body);
        });
        router.delete("/app/memes/votes/", (req, res) => {
            this.Vote.deleteVote(res, req.body);
        });
        this.expressApp.use("/", router);
        this.expressApp.use("/app/json/", express.static(__dirname + "/app/json"));
        this.expressApp.use("/images", express.static(__dirname + "/img"));
        this.expressApp.use("/", express.static(__dirname + "/angularSrc"));
    }
}
exports.App = App;
