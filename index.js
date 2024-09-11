const { timeStamp, group } = require('console');
const { truncate } = require('fs');
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
        allowNull: false
    },
    password: {
        type: Sequelize.DataTypes.STRING
    },
    age: {
        type: Sequelize.DataTypes.INTEGER,
        defaultValue: 21
    }
},{
    freezeTableName: true,
    timeStamp: false
});

//To update table.
User.sync({alter: true}).then(()=>{
    console.log('Table and model syncd succefully');
    //To add data we use a method called build(). It just creates an object which is to be stored in db
    // const user = User.build({username: 'Tio',password: '123',age: 21})
    // return user.save(); //returns a promise

    //Instead of creating build and saving the object each time we can use create() method.

    //Creating single user.
    // return User.create({
    //     username: 'pizza',
    //     password: 'I wanted to live better life.',
    //     age: 5
    // })

    //Returning all users

    //Querying DB
    // return User.findAll();
    // return User.findAll({ attributes: ['username','password']})
    // return User.findAll({attributes: [['username','myName'],['password','pwd']]})
    // return User.findAll({ attributes: [[sequelize.fn('SUM',sequelize.col('age')),'hwOld']]});
    // return User.findAll({attributes: {exclude: ['password']}})
    // return User.findAll({ where: {age:5}});
    // return User.findAll({ attributes: ['username'], where: {age: 5}})
    // return User.findAll({ where: {age: 5,username: 'pizza'}})
    // return User.findAll({limit: 3})

    //Ordering
    // return User.findAll({ order: [['age','ASC']]})

    //Grouping
    // return User.findAll({
    //     attributes: ['username',[sequelize.fn('SUM',sequelize.col('age')),'sum_age']],
    //     group: 'username'
    // })

    //Using op operator
    // return User.findAll({
    //     attributes: ['username'],
    //     where: {
    //         [Op.or]: {username: 'chibi', age: 5 }
    //     }
    // })

    // return User.findAll({
    //     attributes: ['username'],
    //     where: {
    //         [Op.and]: {username: 'pizza', age: 5 }
    //     }
    // })

    // return User.findAll({
    //     where: {
    //         age: {
    //             [Op.gt]: 4
    //         }
    //     }
    // })

    // return User.findAll({
    //     where: {
    //         age: {
    //             [Op.or]: {
    //                 [Op.lt]: 7,
    //                 [Op.gt]: 2
    //             }
    //         }
    //     }
    // })

    //Working with updating the data
    // return User.update({username: 'updated!!!'},{
    //     where: {
    //         age: 3
    //     }
    // })

    //Working with delete 
    // return User.destroy({
    //     where: {
    //         age: 3
    //     }
    // })

    //Delete everything from the table
    // return User.destroy({truncate: true})

    //Utility methods
    return User.sum('age',{
        where: {
            age: 5
        }
    });

})
// .then((data)=>{
//     data.password = 'I am living quiet god life.' 
//     console.log('User added to database',data.toJSON());
//     //to destroy the object and prevent storing in db
//     //return data.destroy();
//     //to revert changes and store the initial state of object in db
//     return data.reload();
// })
.then((data)=>{
    console.log(data);
})
.catch(err => {
    console.log('Eror while syncing table and db', err);
})
