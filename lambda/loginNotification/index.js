const {
    SNSClient,
    PublishCommand,
    ListSubscriptionsByTopicCommand
  } = require("@aws-sdk/client-sns");
  
  const sns = new SNSClient({});
  
  exports.handler = async (event) => {
  
      const body = JSON.parse(event.body);
      const email = body.email;
  
      if (!email) {
        return buildResponse(
          400,
          "Email is required in the event input."
        );
      }
  
      const topicArn = process.env.topicArn;
      try {
  
        console.log("Starting try block");
        console.log("Getting Subscription");
        const subArn = await findSubscriptionArnByEmail(email);
        if (subArn == "PendingConfirmation") {
          return buildResponse(
            200,
            "Confirm the Subscription from your email to get notifications."
          );
        } 
    
        console.log("Sending Notification");
        await sendNotification(
          email,
          "You have Successfully Logges in to the Dev Book Application",
          "Login Confirmation."
        );
  
        return buildResponse(
          200,
          `Email Notification sent to ${email}.`
        );
      } catch (error) {
          return buildResponse(
              500,
              error.message
          );
      }
  };
  
  const findSubscriptionArnByEmail = async (email) => {
    try {
      console.log(process.env.SNS_ARN);
      console.log("Inside Find Subscription Method");
  
      const data = await sns.send(
        new ListSubscriptionsByTopicCommand({ TopicArn: process.env.topicArn })
      );
  
      console.log(data);
      const subscription = data.Subscriptions.find(
        (sub) => sub.Endpoint === email
      );
  
      console.log(subscription);
      if (subscription) {
        return subscription.SubscriptionArn;
      } else {
        return null;
      }
    } catch (error) {
      console.log(error.message);
      throw Error("Error while getting Subscription");
    }
  };
  
  const sendNotification = async (email, message, subject) => {
    try {
      await sns.send(
        new PublishCommand({
          Message: message,
          Subject: subject,
          TargetArn: process.env.topicArn,
          MessageAttributes: {
            email: {
              DataType: "String",
              StringValue: email
            }
          }
        })
      );
    } catch (error) {
      console.log(error.message);
      throw Error(error.message);
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
  