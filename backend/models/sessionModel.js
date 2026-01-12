const { Schema, model } = require("mongoose");

const SessionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});

const SessionModel = model("Session", SessionSchema)

module.exports = SessionModel