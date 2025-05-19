const User = require('./membership/models/user.model');
const UserBalance = require('./transaction/models/userBalance.model');
const Transaction = require('./transaction/models/transaction.model');
const Service = require('./information/models/service.model');
const Banner = require('./information/models/banner.model')

User.hasOne(UserBalance, { foreignKey: 'user_id' });
UserBalance.belongsTo(User, { foreignKey: 'user_id' });

Transaction.belongsTo(User, { foreignKey: 'user_id' });
Transaction.belongsTo(Service, { foreignKey: 'service_code', targetKey: 'service_code' });

Service.hasMany(Transaction, { foreignKey: 'service_code', sourceKey: 'service_code' });

module.exports = {
    User,
    UserBalance,
    Transaction,
    Service,
    Banner
};
