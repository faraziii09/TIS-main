const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const jwtMiddleware = require("./middlewares/jwtMiddleware");
const User = require("./models/User");
const Flow = require("./models/Flow");
const Message = require("./models/Message");
const upload = require("./utils/multerStorage");
const jwt = require("jsonwebtoken");
const http = require("http");
const fs = require("fs");
const { getUsers, setUsers, addUser } = require("./users");

require("dotenv/config");
require("./db")();

const app = express();

// Render/Proxy friendly (important for correct protocol/host)
app.set("trust proxy", 1);

const server = http.createServer(app);

// ✅ Allowed origins (ONLY the ones you need)
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://teaminfosharing.com",
  "https://www.teaminfosharing.com",
];

// ✅ CORS Options (must allow your headers)
const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like curl/postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) return callback(null, true);

    return callback(new Error("Not allowed by CORS: " + origin));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "ngrok-skip-browser-warning",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
  optionsSuccessStatus: 204,
};

// ✅ Apply CORS before routes
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

/* -------------------- SOCKET.IO -------------------- */
const io = require("socket.io")(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const PORT = process.env.PORT || 3000;

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const flowsRouter = require("./routes/flows");
const messagesRouter = require("./routes/messages");

/* -------------------- STATIC -------------------- */
app.use("/assets", express.static(path.join(__dirname, "./files")));

/* -------------------- MIDDLEWARES -------------------- */
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

/* -------------------- AUTH (PUBLIC) -------------------- */
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({
        status: false,
        message: "The user doesn't exist!",
      });
    }

    // NOTE: Your system compares plain password (as in your original code)
    // If you later use bcrypt, this must be changed.
    if (user.password !== password) {
      return res.status(401).json({
        status: false,
        message: "Invalid credentials!",
      });
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    const token = jwt.sign({ id: user._id.toString() }, JWT_SECRET);

    return res.status(200).json({
      status: true,
      token,
      data: user,
      message: "The account with these credentials exists",
    });
  } catch (err) {
    console.log("Login error:", err);
    return res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
});

/* -------------------- PROTECTED ROUTES -------------------- */
app.use(jwtMiddleware);
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/flows", flowsRouter);
app.use("/messages", messagesRouter);

/* -------------------- FILE UPLOAD -------------------- */
app.post("/sendFile", upload.single("file"), async (req, res) => {
  try {
    const uploadedFile = req.file;
    let fileURL = "";

    if (uploadedFile) {
      const fileName = uploadedFile?.filename?.toString()?.replaceAll(" ", "");
      fileURL = `${req.get("x-forwarded-proto") || req.protocol}://${req.get(
        "x-forwarded-host"
      ) || req.get("host")}/assets/${fileName}`;
    }

    let recipients = [];
    const user = await User.findById(req.body?.from);

    if (user?.flow && req.query?.isReply === "false") {
      const flow = await Flow.findById(user?.flow);
      recipients = flow?.recipients;
    }

    if (req.query?.isReply !== "false") {
      recipients.push(req.query?.isReply);
    }

    const data = req.body;
    data["file"] = fileURL;
    data["recipients"] = recipients;

    const newMessage = new Message(data);
    const storeMessage = await newMessage.save();

    const messageStored = await Message.findById(storeMessage?._id)
      .populate("from")
      .populate("recipients")
      .exec();

    if (messageStored?.from?.role !== 1) {
      await User.findOneAndUpdate({ role: 1 }, { $inc: { unreadCount: 1 } });
    }

    io.emit("chat_message", messageStored);

    const onlineRecipients =
      getUsers()?.filter((u) => recipients?.includes(u?._id)) || [];

    const incObj = { $inc: { unreadCount: 1 } };
    if (recipients?.length) {
      await Promise.all(
        recipients.map((recipient) => User.findByIdAndUpdate(recipient, incObj))
      );
    }

    if (onlineRecipients.length) {
      onlineRecipients.forEach((recip) => {
        io.to(recip?.socketId).emit("chat_recipients_updated", {
          recipient: recip?._id,
          update: "increment",
        });
      });
    }

    return res.json({
      status: true,
      data: messageStored,
    });
  } catch (error) {
    console.log("something went wrong:", error);
    return res.status(500).json({
      status: false,
      message: "Something went wrong",
    });
  }
});

/* -------------------- USER TRACKING -------------------- */
const addNewUser = async (UserObj) => {
  if (!getUsers().some((u) => u?._id === UserObj?._id)) {
    addUser(UserObj);
  }
};

const removeUser = (socketId) => {
  console.log(
    "User removed: ",
    getUsers()?.find((u) => u?.socketId === socketId)?.userName
  );
  setUsers(getUsers().filter((u) => u.socketId !== socketId));
};

/* -------------------- SOCKET EVENTS -------------------- */
io.on("connection", (socket) => {
  socket.on("chat_add_user", (UserObj) => {
    addNewUser({
      ...UserObj,
      socketId: socket.id,
    });

    console.log("New user added: ", UserObj?.displayName);

    io.emit(
      "chat_getOnlineUsers",
      getUsers()?.filter((u) => u?.role !== 1)
    );
  });

  socket.on("chat_send_message", async (messageData) => {
    const data = messageData?.message;
    const user = await User.findById(messageData?.message?.from);

    let recipients = [];
    if (user?.flow && !messageData?.isReply) {
      const flow = await Flow.findById(user?.flow);
      recipients = flow?.recipients;
    }

    if (messageData?.isReply) {
      recipients.push(messageData?.isReply);
    }

    data["recipients"] = recipients;

    const newMessage = new Message(data);
    const storeMessage = await newMessage.save();

    const messageStored = await Message.findById(storeMessage?._id)
      .populate("from")
      .populate("recipients")
      .exec();

    if (messageStored?.from?.role !== 1) {
      await User.findOneAndUpdate({ role: 1 }, { $inc: { unreadCount: 1 } });
    }

    io.emit("chat_message", messageStored);

    const onlineRecipients = getUsers()?.filter((u) =>
      recipients?.includes(u?._id)
    );

    const incObj = { $inc: { unreadCount: 1 } };
    await Promise.all(
      recipients.map((recipient) => User.findByIdAndUpdate(recipient, incObj))
    );

    onlineRecipients.forEach((recip) => {
      io.to(recip?.socketId).emit("chat_recipients_updated", {
        recipient: recip?._id,
        update: "increment",
      });
    });
  });

  socket.on("chat_mark_read", async (userId) => {
    await User.findByIdAndUpdate(userId, { unreadCount: 0 });
  });

  socket.on("chat_recipients_update", async (data) => {
    const { recipients, updates } = data;

    const onlineRecipients = getUsers()?.filter((u) =>
      recipients?.includes(u?._id)
    );

    const incObj = { $inc: { unreadCount: 1 } };

    // NOTE: $dec is not a MongoDB operator. Keeping your logic but preventing crash:
    // If you intended decrement, use $inc: { unreadCount: -1 }
    const decObj = { $inc: { unreadCount: -1 } };

    await Promise.all(
      updates.map((update) =>
        User.findByIdAndUpdate(
          update?.recipient,
          update?.update === "increment" ? incObj : decObj
        )
      )
    );

    onlineRecipients.forEach((recip) => {
      io.to(recip?.socketId).emit(
        "chat_recipients_updated",
        updates.find((u) => u?.recipient === recip?._id)
      );
    });
  });

  socket.on("chat_delete_message", async (id) => {
    try {
      const override = {
        type: "deleted",
        content: "This message was deleted",
        recipients: [],
        file: "",
      };

      const deletedMessage = await Message.findByIdAndUpdate(id, override);

      if (deletedMessage?.file) {
        fs.unlink(
          path.join(
            __dirname,
            "../files/" +
              deletedMessage?.file?.slice(
                deletedMessage?.file.indexOf("assets/") + 7
              )
          ),
          (error) => console.log(error)
        );
      }

      io.emit("chat_message_deleted", id);
    } catch (error) {
      console.log(error);
      socket.emit("chat_delete_message_failed", true);
    }
  });

  socket.on("chat_is_typing", (username) => {
    const admin = getUsers()?.find((u) => u?.role === 1);
    if (admin && username !== admin?.displayName) {
      io.to(admin?.socketId).emit("chat_is_typing", username);
    }
  });

  socket.on("disconnect", () => {
    console.log("Socket got disconnected");
    removeUser(socket.id);
    io.emit(
      "chat_getOnlineUsers",
      getUsers()?.filter((u) => u?.role !== 1)
    );
  });
});

/* -------------------- START -------------------- */
server.listen(PORT, () => console.log("The server is listening at: ", PORT));
