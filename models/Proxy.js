module.exports = (sequelize, DataTypes) => {
    return sequelize.define('proxy_manager', {
        sender: {
            type: DataTypes.STRING,
            unique: true
        },
        receiver: {
            type: DataTypes.STRING,
            unique: true
        },
        server: DataTypes.STRING,
	}, {
		timestamps: false,
	});
}