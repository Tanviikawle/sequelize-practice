const { timeStamp, group, error } = require('console');
const { truncate } = require('fs');
const { raw } = require('mysql2');
const { type } = require('os');
const Sequelize  = require('sequelize');
const sequelize = new Sequelize('sequelize','root','root',{
    dialect: 'mysql',
});
const { Op } = Sequelize;

//Check whether db connection is successful or not.
//returns promise
sequelize.authenticate().then(()=>{
    console.log('DB connection successful!')
}).catch(err =>{
    console.log('DB connection error!',err)
})

//To create table , use define method.
const User = sequelize.define('user',{
    username: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [4,6]
        }
    },
    password: {
        type: Sequelize.DataTypes.STRING
    },
    age: {
        type: Sequelize.DataTypes.INTEGER,
        defaultValue: 21,
        validate: {
            // isOldEnough(value){
            //     if(value<21){
            //         throw new Error('Too Young!!')
            //     }
            // }
            // isNumeric: {
            //     msg: 'You must enter a number for age!!'
            // }
            isNumeric: true
        }
    },
    email: {
        type: Sequelize.DataTypes.STRING,
        unique: true,
        // validate: {
        //     isEmail: true
        // }
        // validate: {
        //     isIn: ['tim@gmail.comm','t@gmail.com','tom@gmail.com']
        // }
        // validate: {
        //     isIn: {
        //         args: ['tim@gmail.comm','t@gmail.com','tom@gmail.com'],
        //         msg: 'Please provide one of following email...'
        //     }
        // }
        allowNull: true,
        validate: {
            myEmailValidator(value){
                if(value === null){
                    throw new Error('Please enter an email!')
                }
            }
        }
    }
},{
    freezeTableName: true,
    timeStamp: false,
    validate: {
        usernamePassMatch(){
            if(this.username === this.password){
                throw new Error('Your password cannot be your username!!!')
            }else{
                console.log('I am hungry 😭')
            }
        }
    }
});

//To update table.
User.sync({alter: true}).then(()=>{
    console.log('Table and model syncd succefully');
    //To add data we use a method called build(). It just creates an object which is to be stored in db
    // const user = User.build({username: 'Tio',password: '123',age: 21})
    // return user.save(); //returns a promise

    //Instead of creating build and saving the object each time we can use create() method.

    //Creating single user.
    return User.create({
        username: 'Ball',
        password: 'Ball-e',
        age: 29,
        email: 'ball@gmail.com'
    })

    // const user = User.build({email: 'tom'})
    // return user.validate();

    // return User.findAll();

    //Raw queries
    // return sequelize.query(`Select * from user`,{model: User})
    // return sequelize.query(`UPDATE user SET username = 'Kittu' WHERE id = 1`, {type: Sequelize.QueryTypes.UPDATE} )

}).then((data)=>{
    console.log(data);
    // [result,metadata] = data;
    // console.log('res ----------------', result);
}).catch(err => {
    console.log('Eror while syncing table and db', err);
})
