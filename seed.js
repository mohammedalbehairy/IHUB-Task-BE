const mongoose = require('mongoose')

require('custom-env').env();
const {
  UserModel
} = require('./users/user_model')
async function seed() {

  await mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  });

  //#region Users

  if (await UserModel.countDocuments() > 0) {
    console.log('Admin Users - Already Exist');
    return;
  }
  //-------------------------------------------------------------------------------------//
  let user1 = {
    username: 'mohammed',
    firstname: 'mohammed',
    lastname: 'albehairy'
  }

  user1 = new UserModel(user1);
  user1.setPassword('Mo123456')

  await user1.save(user1);
  console.log('User - Created Successfully');
  //-------------------------------------------------------------------------------------//

  let user2 = {
    username: 'ahmed',
    firstname: 'ahmed',
    lastname: 'ali'
  }

  user2 = new UserModel(user2);
  user2.setPassword('Mo123456')

  await user2.save(user2);
  console.log('User - Created Successfully');
  //-------------------------------------------------------------------------------------//
  let user3 = {
    username: 'mai',
    firstname: 'mohammed',
    lastname: 'mahy'
  }

  user3 = new UserModel(user3);
  user3.setPassword('Mo123456')

  await user3.save(user3);
  console.log('User - Created Successfully');
  //#endregion Users

  mongoose.disconnect();

}

seed()
