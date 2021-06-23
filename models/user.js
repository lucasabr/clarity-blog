const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: false
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
    },
    setupFinished: {
        type: Boolean,
        required: true
    },
    description: {
        type: String, 
        required: false
    }
})

userSchema.statics.create = function(email, password, confirmed, setup) {
    const user = new this({
        email: email,
        password: password,
        confirmed, confirmed,
        setupFinished: setup
    })
    user.save()
}

userSchema.statics.setup = function(name, description){

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