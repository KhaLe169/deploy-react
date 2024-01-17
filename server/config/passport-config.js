const LocalStrategy = require('passport-local').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcrypt')
const User = require('../models/user')
const passport = require('passport');
const Vendor = require('../models/vendor');
const Shipper = require('../models/shipper');
require('dotenv').config()

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback",
  scope: ['profile', 'email'],
},
  async function verify(accessToken, refreshToken, profile, cb) {
    let user = (await User.find({ googleId: profile.id }, { _id: 1, banEndDate: 1, role: 1, banStartDate: 1 }))[0]
    if (user && user.banEndDate && user.banStartDate && (user.banEndDate >= new Date() && new Date() >= user.banStartDate)) return cb(null, false, { message: "Your account has been banned for serveral reasons. Please contact rBuy help center for more information" })
    if (user) {
      return cb(null, user)
    } else {
      let otherUser = (await User.find({ email: profile.emails[0].value }, { name: 1 }))[0]
      if (otherUser) return cb(null, false, { message: "The email already exists" })

      let newUser = new User({
        googleId: profile.id,
        email: profile.emails[0].value,
        verify: true,
        role: "User"
      })
      await newUser.save()
      return cb(null, newUser)
    }
  }
));

passport.use(new LocalStrategy({ usernameField: 'email' }, async function verify(email, password, done) {
  const user = (await User.find({ email: email }, { email: 1, password: 1, verify: 1, banEndDate: 1, role: 1, banStartDate: 1 }))[0] || (await Vendor.find({ email: email }, { email: 1, password: 1, verify: 1, banEndDate: 1, role: 1, banStartDate: 1 }))[0] || (await Shipper.find({ email: email }, { email: 1, password: 1, verify: 1, banEndDate: 1, role: 1, banStartDate: 1 }))[0]
  if (!user) return done(null, false, { message: "Please check the email and password again" }) // check if the user did not exist
  if (!user.password) return done(null, false, { message: "Please check the email and password again" }) // check if the account is gmail account 
  if (!user.verify) return done(null, false, { message: "You need to verify your account with gmail" }) // check if the user email is verify
  if (user.banEndDate && user.banStartDate && (user.banEndDate >= new Date() && new Date() >= user.banStartDate)) return done(null, false, { message: "Your account has been banned for serveral reasons. Please contact rBuy help center for more information" })

  try {
    if (await bcrypt.compare(password, user.password)) {
      return done(null, user, { message: "" })
    } else {
      return done(null, false, { message: "Please check the email and password again" })
    }
  } catch {
    return done(null, false, { message: "Please check the email and password again" })
  }
}))

passport.serializeUser((user, done) => {
  done(null, user._id)
})
passport.deserializeUser(async (id, done) => {
  const user = (await User.find({ _id: id }, { email: 1, phoneNumber: 1, password: 1, verify: 1, role: 1, name: 1, streetAddress: 1, city: 1, ward: 1, district: 1 }))[0] || (await Vendor.find({ _id: id }, { email: 1, phoneNumber: 1, password: 1, verify: 1, role: 1, businessName: 1, address: 1 }))[0] || (await Shipper.find({ _id: id }, { email: 1, phoneNumber: 1, password: 1, verify: 1, role: 1, name: 1, address: 1 }))[0];
  done(null, user)
})
