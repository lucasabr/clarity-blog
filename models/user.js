const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    confirmed: {
        type: Boolean,
        required: true
    }
})

userSchema.statics.create = function(name, email, password, confirmed) {
    const user = new this({
        name: name,
        email: email,
        password: password,
        confirmed, confirmed
    })
    user.save()

}

userSchema.statics.confirmUser = function(id){
    this.findOneAndUpdate({_id: id}, {confirmed: true})
    .then(() => true)
    .catch((err) => err)
}

userSchema.statics.isMailUnique = function(email, callback){
    this.findOne({email: email})
    .then(user => {
        if(user){
            callback(false)
        } else {
            callback(true)
        }
    });
}

userSchema.statics.isNameUnique = function(name, callback){
    this.findOne({name: name})
    .then(user => {
        if(user){
            callback(false)
        } else {
            callback(true)
        }
    });
}



const User = mongoose.model('User', userSchema);

module.exports = User;