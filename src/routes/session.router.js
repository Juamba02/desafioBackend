import { Router } from "express";
import userModel from "../daos/mongodb/models/users.model.js";
import { createHash, validatePassword } from "../utils.js";
import passport from "passport";

const router = Router();

router.post("/register", passport.authenticate('register', {failureRedirect:'/register'}), async (req, res) => {
  res.send({status:"success", message:"User registered"})
});

router.post("/login", passport.authenticate('login', {failureRedirect:'/login'}), async (req, res) => {
  if(!req.user) return res.status(400).send({status:'error', error:'invalid credentials'})
  req.session.user = {
    first_name: req.user.first_name,
    last_name: req.user.last_name,
    email: req.user.email,
    age: req.user.age,
  }
  res.send({status:'success', payload: req.user})
});

router.get(
  "/github",
  passport.authenticate("github", { scope: "user:email" }),
  (req, res) => {}
);

router.get('/githubcallback',passport.authenticate('github', {failureRedirect: '/login'}),async (req, res)=>{
  console.log('exito')
  req.session.user = req.user
  res.redirect('/')
} )

export default router;
