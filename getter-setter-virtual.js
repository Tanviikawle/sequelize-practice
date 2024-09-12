const { timeStamp, group, error } = require('console');
const { truncate } = require('fs');
const { raw } = require('mysql2');
const { type } = require('os');
const Sequelize  = require('sequelize');
const sequelize = new Sequelize('sequelize','root','root',{
    dialect: 'mysql',
});
const { Op } = Sequelize;
const zlib = require('zlib');

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
        },
        get(){
            const rawValue = this.getDataValue('username');
            return rawValue.toUpperCase(); 
        }
    },
    password: {
        type: Sequelize.DataTypes.STRING,
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
    },
    description: {
        type: Sequelize.DataTypes.STRING,
        set(value){
            const compressed = zlib.deflateSync(value).toString('base64');
            this.setDataValue('description',compressed);
        },
        get(){
            const value = this.getDataValue('description');
            const uncompressed = zlib.inflateSync(Buffer.from(value,'base64'));
            return uncompressed.toString();
        }
    },
    aboutUser: {
        type: Sequelize.DataTypes.VIRTUAL,
        get(){
            return `${this.username} ------ ${this.description}`;
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
    // return User.create({
    //     username: 'UserN',
    //     password: '123456',
    //     age: 27,
    //     email: 'abc@gmail.com',
    //     description: 'this is some description'
    // })
    return User.findOne({where: {id: 11}});

}).then((data)=>{
    console.log(data.description);
    // data.forEach(element => {
    //     console.log(element.username)
    // });
    // [result,metadata] = data;
    // console.log('res ----------------', result);
}).catch(err => {
    console.log('Eror while syncing table and db', err);
})
