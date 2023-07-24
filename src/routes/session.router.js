import { Router } from "express";
import userModel from "../daos/mongodb/models/users.model.js";
import { createHash, validatePassword } from "../utils.js";
import passport from "passport";
import jwt from "jsonwebtoken"

const router = Router();

router.post(
  "/register",
  passport.authenticate("register", { session: false }),
  async (req, res) => {
    res.send({ status: "success", message: "usuario  registrado" });
  }
);

router.post(
  "/login",
  passport.authenticate("login", { session: false }),
  async (req, res) => {
    let token = jwt.sign({ email: req.body.email }, "coderSecret", {
      expiresIn: "24h",
    });
    res
      .cookie("coderCookie", token, { httpOnly: true })
      .send({ status: "success" });
  }
);

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.send(req.user);
  }
);

router.get(
  "/github",
  passport.authenticate("github", { scope: "user:email" }),
  (req, res) => {}
);

router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    console.log("exito");
    req.session.user = req.user;
    res.redirect("/");
  }
);

export default router;
