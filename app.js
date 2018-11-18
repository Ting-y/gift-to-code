

'use strict';
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
// Imports dependencies and set up http server
const 
  request = require('request'),
  express = require('express'),
  body_parser = require('body-parser'),
  app = express().use(body_parser.json()); // creates express http server



const algorithm = require("./algorithm.js") 
// Sets server port and logs message on success
app.listen(process.env.PORT || 3000, () => console.log('webhook is listening'));

// Accepts POST requests at /webhook endpoint
app.post('/webhook', (req, res) => {  

  // Parse the request body from the POST
  let body = req.body;

  // Check the webhook event is from a Page subscription
  if (body.object === 'page') {
    console.log(body.entry)
    body.entry.forEach(function(entry) {

      // Gets the body of the webhook event
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);


      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;
      console.log('Sender ID: ' + sender_psid);

      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message);        
      } else if (webhook_event.postback) {
        handlePostback(sender_psid, webhook_event.postback);
      }
    });
    // Return a '200 OK' response to all events
    res.status(200).send('EVENT_RECEIVED');

  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});

// Accepts GET requests at the /webhook endpoint
app.get('/webhook', (req, res) => {
  
  /** UPDATE YOUR VERIFY TOKEN **/
  const VERIFY_TOKEN = "shuuupergood";
  
  // Parse params from the webhook verification request
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
    
  // Check if a token and mode were sent
  if (mode && token) {
  
    // Check the mode and token sent are correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      
      // Respond with 200 OK and challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);      
    }
  }
});

function isFirstTimeChatting(text) {
  return (text.toLowerCase() === "get started")
}
function handleMessage(sender_psid, received_message) {
  let response;
  
  // Checks if the message contains text
  if (received_message.text) {
    var inputText = received_message.text;
    console.log(received_message.text)


    // check the start keyword and ask 1 first question 
    if (isFirstTimeChatting(inputText)) {
      response = {
        "text": "My name is Electra, and I’m a chatbot. I’ll help you out until a councillor is available to chat with you! \n What's on your mind today?"
      }

        // Send the response message
      callSendAPI(sender_psid, response)
      .then((result) => {
        delay(3000)
      })
    } else {
      const articleURL = algorithm.getMostRelevantArticle(inputText)
      console.log(articleURL)
      // Create the payload for a basic text message, which
      // will be added to the body of our request to the Send API
      response = {
        "text": `Sounds like there is a lot on your mind. We are happy to help, you are currently 5th in the Queue. While you wait, would you like to look through this link? ${articleURL}`
      }
      console.log(response)
              // Send the response message
      callSendAPI(sender_psid, response)
      .then((result) => {
        return delay(3000)
      })
      .then((result) => {
        return callSendAPI("2177375635658158", qustionYesOrNo)
      })
    }

  } else if (received_message.attachments) {
    // Get the URL of the message attachment
    let attachment_url = received_message.attachments[0].payload.url;
    response = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [{
            "title": "Is this the right picture?",
            "subtitle": "Tap a button to answer.",
            "image_url": attachment_url,
            "buttons": [
              {
                "type": "postback",
                "title": "Yes!",
                "payload": "yes",
              },
              {
                "type": "postback",
                "title": "No!",
                "payload": "no",
              }
            ],
          }]
        }
      }
    }
  } 

}


function handlePostback(sender_psid, received_postback) {
  console.log('ok')
   let response;
  // Get the payload for the postback
  let payload = received_postback.payload;
  const moreText = "Excellent! Glad to hear that! You are currently 3rd in the Queue and we are doing everything we can to talk to you as soon as possible. While you're waiting, would you like to play this game? https://kidshelpphone.ca/get-info/tension-release-exercise/"
  // Set the response based on the postback payload
  if (payload === 'yes') {
    response = { "text": moreText }
  } else if (payload === 'no') {
    response = { "text": "Sorry to heard that, You are currently 3rd in the Queue and we are doing everything we can to talk to you as soon as possible. While you're waiting, would you like to play https://kidshelpphone.ca/get-info/bullying-incident-report/" }
  }
  // Send the message to acknowledge the postback
  callSendAPI(sender_psid, response)

}

async function callSendAPI(sender_psid, response) {
  // Construct the message body
  let request_body = {
    "recipient": {
      "id": "2177375635658158"
    },
    "message": response
  }

  // Send the HTTP request to the Messenger Platform
  return request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log(body)
      console.log('message sent!')
    } else {
      console.error("Unable to send message:" + err)
    }
  })
}


let delay = (time) => (result) => new Promise(resolve => setTimeout(() => resolve(result), time));

const qustionYesOrNo = {
  "attachment": {
    "type": "template",
    "payload": {
      "template_type": "generic",
      "elements": [{
        "title": "Did this article resonate  with you?",
        "subtitle": "Tap a button to answer.",
        "buttons": [
          {
            "type": "postback",
            "title": "Yes!",
            "payload": "yes",
          },
          {
            "type": "postback",
            "title": "No!",
            "payload": "no",
          }
        ],
      }]
    }
  }
}

const morelink = {

}