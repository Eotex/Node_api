import express from 'express';
import validateInput from '../common/loginValidator';
import User from '../model/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config/types';

const router = express.Router();

router.post('/', (req, res) =>{
    const { errors, isValid } = validateInput(req.body);
    if(isValid){
        const { email, password} = req.body;
        User.findOne({ email: email }).then(user => {
            if(user){
                if(bcrypt.compareSync(password, user.password)){
                    const token = jwt.sign({
                        id: user._id,
                        email: user.email,
                        firstname: user.firstname,
                        active_role: user.active_user  
                    }, config.jwtSecret, {expiresIn: '2h'});
                    res.json({token});
                }else{
                    res.status(401).json({ errors: { form: 'Invalid credentials'}});
                }
            }else{
                res.status(401).json({ errors: { form: 'Email does not exist'}});
            }
        });
    }else{
        res.status(400).json(errors);
    }
});

module.exports = router;