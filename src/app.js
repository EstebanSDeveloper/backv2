import express from "express";
import handlebars from "express-handlebars";
import { options } from "./config/options.js";
import { __dirname } from "./utils.js";
import path from "path";
import { productsRouter } from "./routes/products.routes.js";
import { cartsRouter } from "./routes/carts.routes.js";
import { webRouter } from "./routes/web.routes.js";
import { mocksRouter } from "./routes/mock.routes.js";
import { usersRouter } from "./routes/users.routes.js";
import "./config/dbConnection.js";
import { Server } from "socket.io";
import { chatManagerMongo } from "./daos/managers/chatManagerMongo.js";
import { ChatModel } from "./daos/models/chat.model.js";
import { authRouter } from "./routes/auth.routes.js";
import passport from "passport";
import { initializePassport } from "./config/passport.config.js";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorHandler.js";
//documentacion
import { swaggerSpecs } from "./config/docConfig.js";
import swaggerUI from "swagger-ui-express"


//service
const chatManager = new chatManagerMongo(ChatModel);
// Ejecucion del servidor
const port = options.server.port;
const app = express();
const httpServer = app.listen(port, () =>
	console.log(`Server listening on port ${port}`)
);

//adicional creamos un servidor para websocket.
const socketServer = new Server(httpServer);

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));
app.use(cookieParser())

httpServer.on("error", (error) => console.log(`Error in server ${error}`));

//configuracion de passport
initializePassport();
app.use(passport.initialize());

//configuracion motor de plantillas handlebars
app.engine(".hbs", handlebars.engine({ extname: ".hbs" }));
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", ".hbs");

//route for documentations
app.use("/api/docs", swaggerUI.serve,swaggerUI.setup(swaggerSpecs))

//routes
app.use(webRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", authRouter);
app.use("/api/mockingproducts", mocksRouter)
app.use("/api/users", usersRouter)
app.use(errorHandler)

//configuración socket servidor
// const messages=[];
socketServer.on("connection", async (socketConnected) => {
	console.log(`Nuevo cliente conectado ${socketConnected.id}`);
	const messages = await chatManager.getMessages();
	socketServer.emit("msgHistory", messages);
	//capturamos un evento del socket del cliente
	socketConnected.on("message", async (data) => {
		//recibimos el msg del cliente y lo guardamos en el servidor con el id del socket.
		await chatManager.addMessage(data);
		const messages = await chatManager.getMessages();
		// messages.push({socketId: socketConnected.id, message: data});
		//Enviamos todos los mensajes a todos los clientes
		socketServer.emit("msgHistory", messages);
	});
});


//afetr min 47 segunda parte del desafio