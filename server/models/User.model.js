//user schema
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, trim: true },
    password: {
      type: String,
      required: true,
      trim: true,
      set: (v) => {
        let saltKey = bcrypt.genSaltSync(10);
        let encryptedPassword = bcrypt.hashSync(v, saltKey);
        return encryptedPassword;
      },
    },
    role: { type: String, enum: ["user", "admin"] },
    timestamp: { type: Date, default: Date.now },
  },
  { versionKey: false },
  { toJSON: { getters: true } }
);

userSchema.statics.checkPassword = function (password, encryptedPassword) {
  return bcrypt.compareSync(password, encryptedPassword);
};
module.exports = mongoose.model("user", userSchema);
