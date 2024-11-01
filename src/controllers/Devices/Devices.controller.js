const { FitBidConnections } = require('../../models/FitBidConnections/FitBidConnections.model');
const { GarminConnectionsModel } = require('../../models/GarminConnections/GarminConnections.model');
const querystring = require('querystring');
const fs = require('fs');
const axios = require('axios');
const { appLogger } = require('../../config/appLogger');

const FITBIT_CLIENT_ID = '23PL7M';
const clientSecret = '42787ee48e81e953155f917776d6ed9b';
const REDIRECT_URI = 'https://f46a-2409-40c4-27d-41fa-15b2-b006-13ae-fb3b.ngrok-free.app/Devices/confirmFitBidConnection';
const basicToken = Buffer.from(`${FITBIT_CLIENT_ID}:${clientSecret}`).toString('base64');

// Helper function to handle common errors and send responses
const handleError = (res, error, message = 'An error occurred') => {
  appLogger.error(`${message}: ${error.message}`);
  res.status(500).send({ message });
};

exports.getConnectedDevices = async (req, res) => {
  try {
    const { UserId } = req.user;
    appLogger.info('Fetching connected devices for user', UserId);

    const DevicesModel = [
      { model: FitBidConnections, name: 'Fit Bid' },
      { model: GarminConnectionsModel, name: 'Garmin' }
    ];

    const connectedDevices = await Promise.all(
      DevicesModel.map(async (device) => {
        try {
          const connectedDevice = await device.model.findOne({
            where: { UserId, Connected: true }
          });
          if (connectedDevice) {
            connectedDevice['dataValues']['Device Name'] = device.name;
            return connectedDevice;
          }
          return null;
        } catch (error) {
          appLogger.warn(`Error fetching ${device.name} for user ${UserId}: ${error.message}`);
          return null;
        }
      })
    );

    res.status(200).send(connectedDevices.filter(Boolean));
  } catch (error) {
    handleError(res, error, 'Failed to fetch connected devices');
  }
};

exports.connectFitBidDevice = async (req, res) => {
  try {
    const { UserId } = req.user;
    appLogger.info('Initiating Fitbit connection for user', UserId);

    const scope = 'activity heartrate sleep profile';
    const fitbitAuthUrl = `https://www.fitbit.com/oauth2/authorize?${querystring.stringify({
      client_id: FITBIT_CLIENT_ID,
      response_type: 'code',
      scope,
      redirect_uri: REDIRECT_URI,
      state: UserId
    })}`;

    res.status(200).send({
      message: 'Fitbit connection initiated',
      url: fitbitAuthUrl
    });
  } catch (error) {
    handleError(res, error, 'Failed to initiate Fitbit connection');
  }
};

exports.confirmFitBidConnection = async (req, res) => {
  const { code, state: UserId } = req.query;

  if (!code || !UserId) {
    return res.status(400).send({ message: 'Invalid request parameters' });
  }

  try {
    appLogger.info('Confirming Fitbit connection for user', UserId);

    const response = await axios.post(
      'https://api.fitbit.com/oauth2/token',
      new URLSearchParams({
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI,
        code
      }),
      {
        headers: {
          Authorization: `Basic ${basicToken}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    const { refresh_token, access_token, user_id } = response.data;
    appLogger.info('Received Fitbit tokens for user', UserId);

    await FitBidConnections.update(
      {
        Connected: true,
        Code: code,
        FitBidRefreshToken: refresh_token,
        FitBidAccessToken: access_token,
        FitBidUserId: user_id,
        ConnectedAt: new Date()
      },
      { where: { UserId } }
    );

    const rootDir = __dirname.split('/').slice(0, -2).join('/');
    const htmlFile = fs.readFileSync(`${rootDir}/views/fitbidConnection.html`, 'utf-8');
    res.send(htmlFile);
  } catch (error) {
    appLogger.error(`Failed to confirm Fitbit connection for user ${UserId}: ${error.response ? error.response.data : error.message}`);
    handleError(res, error, 'Failed to confirm Fitbit connection');
  }
};
