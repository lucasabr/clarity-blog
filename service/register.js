class register{
    registerUser(){
        User.isMailUnique(req.body.email, function(isUnique) {
            if(!isUnique){
                res.render("register.ejs", {message: "ERROR! There already exists an account with this email"}) 
                unique=false
            }
            else{
                User.isNameUnique(req.body.name, async function(isUnique) {
                    if(!isUnique){
                        res.render("register.ejs", {message: "ERROR! There already exists an account with this name"}) 
                        unique=false
                    } else{
                        try{
                            const hashedPassword = await bcrypt.hash(req.body.password, 10);
                            User.create(req.body.name, req.body.email, hashedPassword, false)
                            res.render("register.ejs", {message: "Please confirm your account via email before logging in."})
                        } catch (e){
                            console.log(e);
                            res.redirect('/register')
                        }
                    }
                })
            }
        })
    }
}