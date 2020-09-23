module.exports = (sequelize, DataTypes) => {
    return sequelize.define('role_managers', {
        tag: {
            type: DataTypes.STRING,
            unique: true
        },
        link: DataTypes.STRING,
        emoji: DataTypes.STRING,
        role: DataTypes.STRING
	}, {
		timestamps: false,
	});
}