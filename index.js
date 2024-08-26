const { timeStamp } = require('console');
const Sequelize  = require('sequelize');
const sequelize = new Sequelize('sequelize','root','root',{
    dialect: 'mysql',
});

//Check whether db connection is successful or not.
//returns promise
sequelize.authenticate().then(()=>{
    console.log('DB connection successful!')
}).catch(err =>{
    console.log('DB connection error!',err)
})

//To create table , use defime method.
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
    //To add data we use a method called build().
    // const user = User.build({username: 'Tio',password: '123',age: 21})
    // return user.save(); //returns a promise

    //Instead of creating build and saving the object each time we can use create() method.

    return User.create({
        username: 'pizza',
        password: 'I wanted to live better life.',
        age: 5
    })
})
.then((data)=>{
    data.password = 'I am living quiet god life.' 
    console.log('User added to database',data.toJSON());
    //to destroy the object and prevent storing in db
    //return data.destroy();
    //to revert changes and store the initial state of object in db
    return data.reload();
})
.then((data)=>{
    console.log('user updated',data.toJSON());
})
.catch(err => {
    console.log('Eror while syncing table and db', err);
})
