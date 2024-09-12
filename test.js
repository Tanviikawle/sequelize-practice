const Sequelize = require('sequelize');
const sequelize = new Sequelize('sequelize','root','root',{
    dialect: 'mysql'
});
const { DataTypes, Op } = require('sequelize');

sequelize.authenticate().then(()=>{
    console.log('DB Connection successful!')
}).catch((err)=>{
    console.log('Failed to connect to DB.',err)
})

const User = sequelize.define('student',{
    student_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [4,20]
        }
    },
    favourite_class: {
        type: DataTypes.STRING,
        defaultValue: 'Computer Science'
    },
    school_year: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    subscribed_to_wittcode: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
},{
    freezeTableName: true,
    timeStamps: false
});

User.sync({alter: true}).then(()=>{
    // return User.bulkCreate([
    //     {
    //         student_id: 10,
    //         name: 'Tun',
    //         school_year: 2024,
    //         subscribed_to_wittcode: true
    //     },
    //     {
    //         student_id: 9,
    //         name: 'Tik',
    //         school_year: 2013,
    //         subscribed_to_wittcode: false
    //     }
    // ])
    return User.findAll({
        attributes: [[sequelize.fn('COUNT',sequelize.col('student_id')), 'num_studens']],
        group: 'school_year'
    })
})
.then((data)=>{
    data.forEach(element => {
        console.log(element.toJSON())   
    });
    // console.log(data)
})
.catch((err)=>{
    console.log(err);
})