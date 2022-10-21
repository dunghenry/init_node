const express = require('express');
const dotenv = require('dotenv');
const { ApolloServer, gql } = require('apollo-server-express');
dotenv.config();
const colors = require('colors');
const os = require('os');
process.env.UV_THREADPOOL_SIZE = os.cpus.length;
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const winston = require('winston');
const expressWinston = require('express-winston');
const openapiSpecification = require('./helpers/docs.api');
const swaggerUi = require('swagger-ui-express');
require('winston-mongodb');
const connectDB = require('./configs/connect.db');
const viewEngine = require('./configs/viewEngine');
const { myFormat } = require('./helpers/logger');
const port = process.env.PORT || 4000;
const routes = require('./routes');
const db = require('../db.json');
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cookieParser());
// app.use(helmet());
connectDB();
viewEngine(app);
routes(app);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));
app.use(
    expressWinston.logger({
        transports: [
            new winston.transports.MongoDB({
                db: process.env.MONGODB_URI,
                options: {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                },
                collection: 'logs',
            }),
        ],
        format: winston.format.combine(
            winston.format.json(),
            winston.format.timestamp(),
            winston.format.metadata(),
            winston.format.prettyPrint(),
        ),
        // winstonInstance: logger,
        statusLevels: true,
    }),
);

app.use(
    expressWinston.errorLogger({
        transports: [
            new winston.transports.File({
                filename: 'src/logs/logsInternalErrors.log',
            }),
        ],
        format: winston.format.combine(
            winston.format.json(),
            winston.format.timestamp(),
            winston.format.metadata(),
            winston.format.prettyPrint(),
            myFormat,
        ),
    }),
);
const typeDefs = gql`
    type Book {
        id: ID
        title: String
        author: String
    }
    type Query {
        books: [Book]
    }
`;
const resolvers = {
    Query: {
        books: () => {
            return db.books;
        },
    },
};
const server = new ApolloServer({
    typeDefs,
    resolvers,
    // context: ({ req, res }) => ({ req, res }),
});
server.start().then(() => {
    server.applyMiddleware({
        app,
    });
    app.listen(port, () =>
        console.log(
            colors.green(
                `Server listening on http://localhost:${port}${server.graphqlPath}`,
            ),
        ),
    );
});
