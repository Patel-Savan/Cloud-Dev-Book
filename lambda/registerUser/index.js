const { SNSClient, SubscribeCommand } = require("@aws-sdk/client-sns");

const snsClient = new SNSClient({});

exports.handler = async (event) => {

    const body = JSON.parse(event.body);
    const email = body.email;

    if (!email) {
        return buildResponse(400, "Email is required in the event input.");
    }

    const topicArn = process.env.topicArn;
    try {

        const subscribeParams = {
            Protocol: "email",
            TopicArn: topicArn,
            Endpoint: email,
            Attributes: { FilterPolicy: JSON.stringify({ email: [email] }) }
        };

        await snsClient.send(new SubscribeCommand(subscribeParams));

        return buildResponse(200, `Subscription request sent to ${email}.`);
    } catch (error) {
        return buildResponse(500, error.message);
    }
};

const buildResponse = (statusCode, message) => {
    const Response = {
      statusCode: statusCode,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-type": "application/json"
      },
      body: JSON.stringify(message)
    };
  
    return Response;
};
