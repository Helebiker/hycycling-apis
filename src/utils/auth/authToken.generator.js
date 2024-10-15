const uuid = require('uuid')
const { AuthTokenModel } = require('../../models/AuthToken/AuthToken.model')

exports.createNewAuthToken = async ({ UserId }) => {
  try {
    const AuthToken = uuid.v4(); // Generate a new UUID

    // Get the current auth tokens for the user
    const existingTokens = await AuthTokenModel.findAll({
      where: { UserId },
      order: [['createdAt', 'ASC']] // Sorting by creation date to identify the oldest tokens
    });

    // If there are already 3 or more tokens, delete the oldest one(s)
    if (existingTokens.length >= 3) {
      const oldestToken = existingTokens[0]; // First one is the oldest due to sorting
      await AuthTokenModel.destroy({
        where: { id: oldestToken.id }
      });
    }

    // Create and store the new auth token
    await AuthTokenModel.create({
      UserId,
      token: AuthToken,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return AuthToken;
  } catch (error) {
    throw new Error('Error creating new auth token');
  }
};
