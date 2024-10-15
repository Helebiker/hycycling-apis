exports.sendOTPTemplate = otp => {
  return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Email - IA Cycling</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }

        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .header {
            text-align: center;
            padding: 20px;
        }

        .header img {
            max-width: 150px;
            height: auto;
        }

        .header h2 {
            font-size: 20px;
            color: #333333;
        }

        .content {
            text-align: center;
            padding: 20px;
        }

        .content h1 {
            font-size: 24px;
            color: #333333;
        }

        .content p {
            font-size: 16px;
            color: #555555;
            margin: 20px 0;
        }

        .otp {
            display: inline-block;
            font-size: 32px;
            letter-spacing: 10px;
            font-weight: bold;
            color: #333333;
            background-color: #f8f8f8;
            padding: 10px 20px;
            border-radius: 5px;
        }

        .footer {
            text-align: center;
            font-size: 12px;
            color: #888888;
            padding: 20px;
        }
    </style>
</head>
<body>

    <div class="email-container">
        <!-- Header with logo and app name -->
        <div class="header">
            <img src="https://i.ibb.co/D19hYxK/Group-12.png" alt="Logo">
            <h2>IA Cycling</h2>
        </div>

        <!-- Email content -->
        <div class="content">
            <!-- English Section -->
            <h1>Verify Your Account</h1>
            <p>Your one-time password (OTP) for account verification is:</p>
            <div class="otp">${otp}</div>
            <p>Please use this OTP within 10 minutes to complete your verification.</p>

            <hr style="margin: 40px 0; border: none; border-top: 1px solid #dddddd;">

            <!-- Spanish Section -->
            <h1>Verifica tu cuenta</h1>
            <p>Tu contraseña de un solo uso (OTP) para la verificación de la cuenta es:</p>
            <div class="otp">${otp}</div>
            <p>Por favor, utiliza este OTP dentro de los próximos 10 minutos para completar la verificación.</p>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>If you didn't request this email, please ignore it.</p>
            <p>Si no solicitaste este correo electrónico, ignóralo.</p>
            <p>&copy; 2024 IA Cycling. All rights reserved. | Todos los derechos reservados.</p>
        </div>
    </div>

</body>
</html>

    `
}
