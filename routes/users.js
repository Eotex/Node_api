import express from 'express';
import commonValidations from '../common/RegisterValidator';
import bcrypt from 'bcrypt';
import User from '../model/User';
import isEmpty from 'lodash/isEmpty';

const router = express.Router();
function validateInput(data, otherValidation){
    let { errors } = otherValidation(data);
    return User.findOne({ email: data.email }).then(user => {
        if(user){
            if(user.email === data.email){
                errors.email = "There is user with such email";
            }
        }
        return {
            errors,
            isValid: isEmpty(errors)
        }
    });
}

router.post('/', (req, res) =>{
    validateInput(req.body, commonValidations).then(({errors, isValid}) =>{
        if(isValid){
            const { firstname, lastname, email, phone_number, password } = req.body;
            //Hash Password
            const password_digest = bcrypt.hashSync(password, 10);
            const newUser = new User({
                firstname,
                lastname,
                email,
                phone_number,
                active_user: "Quest",
                password: password_digest
            });
            newUser.save()
            .then(user => {
                res.json({ success: true });
            })
            .catch(err => {
                res.status(500).json({error: {form: "Your cannot signup, try later"}});
            });
        }else{
            res.status(400).json(errors);
        }
    });
});

module.exports = router;