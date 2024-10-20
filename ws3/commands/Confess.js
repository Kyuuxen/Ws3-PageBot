const fs = require('fs');
const count = parseInt(fs.readFileSync(__dirname + 'count', 'utf8')) || 0
module.exports.config = {
  name: "confess",
  version: "1.0.0",
  role: 0,
  credits: "𝙱𝚒𝚜𝚊𝚢𝚊 𝚖𝚘𝚍𝚒𝚏𝚒𝚎𝚍: 𝚇𝚊𝚟",
  description: "𝙿𝚘𝚜𝚝 𝚊 𝙲𝚘𝚗𝚏𝚎𝚜𝚜𝚒𝚘𝚗.",
  commandCategory: "𝙲𝚘𝚗𝚏𝚎𝚜𝚜𝚒𝚘𝚗",
  cooldowns: 5,
  usePrefix: true
};

module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageID, senderID } = event;
  const text = args[0]
  const sender = args[1]
  const receiver = args[2]
  if (! receiver || ! sender|| !text) return api.sendMessage('Error input. \nUse: confess <text> <sender> <receiver>', threadID, messageID)
  const uuid = getGUID();
  const formData = {
    "input": {
      "composer_entry_point": "inline_composer",
      "composer_source_surface": "timeline",
      "idempotence_token": uuid + "_FEED",
      "source": "WWW",
      "attachments": [],
      "audience": {
        "privacy": {
          "allow": [],
          "base_state": "EVERYONE", // SELF EVERYONE
          "deny": [],
          "tag_expansion_state": "UNSPECIFIED"
        }
      },
      "message": {
        "ranges": [],
        "text": `𝙲𝙾𝙽𝙵𝙴𝚂𝚂𝙸𝙾𝙽 𝙿𝙾𝚂𝚃 #${count}\n\n𝚃𝙾: ${receiver}\n\n𝙼𝚎𝚜𝚜𝚊𝚐𝚎: ${text}\n\n𝙵𝚛𝚘𝚖: ${sender}`
      },
      "with_tags_ids": [],
      "inline_activities": [],
      "explicit_place_id": "0",
      "text_format_preset_id": "0",
      "logging": {
        "composer_session_id": uuid
      },
      "tracking": [
        null
      ],
      "actor_id": api.getCurrentUserID(),
      "client_mutation_id": Math.floor(Math.random()*17)
    },
    "displayCommentsFeedbackContext": null,
    "displayCommentsContextEnableComment": null,
    "displayCommentsContextIsAdPreview": null,
    "displayCommentsContextIsAggregatedShare": null,
    "displayCommentsContextIsStorySet": null,
    "feedLocation": "TIMELINE",
    "feedbackSource": 0,
    "focusCommentID": null,
    "gridMediaWidth": 230,
    "groupID": null,
    "scale": 3,
    "privacySelectorRenderLocation": "COMET_STREAM",
    "renderLocation": "timeline",
    "useDefaultActor": false,
    "inviteShortLinkKey": null,
    "isFeed": false,
    "isFundraiser": false,
    "isFunFactPost": false,
    "isGroup": false,
    "isTimeline": true,
    "isSocialLearning": false,
    "isPageNewsFeed": false,
    "isProfileReviews": false,
    "isWorkSharedDraft": false,
    "UFI2CommentsProvider_commentsKey": "ProfileCometTimelineRoute",
    "hashtag": null,
    "canUserManageOffers": false
  };
  try {
    const results = createPost(api, formData)
    return api.sendMessage(`𝐏𝐨𝐬𝐭𝐞𝐝 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲!\n𝙿𝚘𝚜𝚝: ${results.postURL})`, event.senderID)
  } catch (e) {
    api.sendMessage(e, event.senderID)
  }
  
};

async function createPost(api, formData) {
  return new Promise((resolve, reject) => {
    const form = {
      av: api.getCurrentUserID(),
      fb_api_req_friendly_name: "ComposerStoryCreateMutation",
      fb_api_caller_class: "RelayModern",
      doc_id: "7711610262190099",
      variables: JSON.stringify(formData)
    };

    api.httpPost('https://www.facebook.com/api/graphql/', form, (error, result) => {
      if (error) {
        reject(error);
      } else {
        try {
          const responseData = JSON.parse(result.replace("for (;;);", ""));
          const postID = responseData.data.story_create.story.legacy_story_hideable_id;
          const postURL = responseData.data.story_create.story.url;
          resolve({ postID, postURL });
        } catch (parseError) {
          reject(parseError);
        }
      }
    });
  });
}

function getGUID() {
  var sectionLength = Date.now();
  var id = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = Math.floor((sectionLength + Math.random() * 16) % 16);
    sectionLength = Math.floor(sectionLength / 16);
    var _guid = (c == "x" ? r : (r & 7) | 8).toString(16);
    return _guid;
  });
  return id;
