import express from "express";
import db from "../db/connection.js";
import contactlist from "../components/contactlist.js";

const mainpageRouter = express.Router();

mainpageRouter.use("/mainpage",contactlist);

export default mainpageRouter;