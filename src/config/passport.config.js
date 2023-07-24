import passport from "passport";
import local from 'passport-local';
import GithubStrategy from "passport-github2";
import userModel from "../daos/mongodb/models/users.model.js";
import { validatePassword } from "../utils.js";
import { createHash } from "../utils.js";

const LocalStrategy = local.Strategy

export const initializePassport = () => {
  passport.use(
    "github",
    new GithubStrategy(
      {
        clientID: "Iv1.4749ab7f100b0401",
        clientSecret: "7574f3a9a6ae3adadc135331275ba11184ecea13",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log(profile)
        let user = await userModel.findOne({ email: profile._json.email });
        if (!user) {

          let newUser = {
            first_name: profile.username,
            last_name: "test lastname",
            email: profile.profileUrl ,
            age: 25,
            password: "1234",
          };
          const result = await userModel.create(newUser);
          done(null, result);
        } else {
          done(null, false);
        }
      }
    )
  );

  passport.use('register', new LocalStrategy(
    {passReqToCallback:true, usernameField:'email'}, async (req, username, password, done) => {
        const {first_name, last_name, email, age} = req.body;
        try{
            let user = await userModel.findOne({email:username})
            if (user) {
                console.log('user already exists');
                return done(null, false)
            }
            const newUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password)
            }
            let result = await userModel.create(newUser)
            return done(null, result)
        }catch (error){
            return done('error al obtener el usuario:   ' + error)
        }
    }
  ))

  passport.use('login', new LocalStrategy({usernameField:'email'}, async (username, password, done) => {
    try{
        const user = await userModel.findOne({email:username})
        if(!user) {
            console.log('user doesnt exist');
            return done(null, false)
        }
        if(!validatePassword(password, user)) return done(null, false)
        return done(null, user)
    }catch (error){
        return done(error)
    }
  }))

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await userModel.findById(id);
    done(null, user);
  });
};