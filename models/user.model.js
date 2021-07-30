const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const userSchema = new Schema({
  name: String,
  email: { type : String , unique : true, required : true },
  phone: String,
  password: String,
  reset_password_hash: String,
  sesson: Array,
  sesson_id: mongoose.Schema.Types.ObjectId
}, { timestamps: { createdAt: "created_at", updatedAt: "modified_at" } });


userSchema.statics = {
  list({ query, limit, page, search }) {
    const options = {
      select: 'name email phone _id',
      sort: { created_at: -1 },
      lean: true,
      page: page || 1,
      limit: limit || 20,
    };
    
    return this.paginate(query, options);
  }
}

userSchema.plugin(mongoosePaginate);

const user = mongoose.model('user', userSchema);

module.exports = user;