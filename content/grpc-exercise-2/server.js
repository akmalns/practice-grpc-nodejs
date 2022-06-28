/**
 * Reference : https://www.youtube.com/watch?v=Yw4rkaTc0f8
 */

const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const loaderOptions = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
};

const PROTO_PATH = __dirname + "/todo.proto";

const packageDefinition = protoLoader.loadSync(PROTO_PATH, loaderOptions);

const todoPackage = grpc.loadPackageDefinition(packageDefinition).todoPackage;

const todos = [];

function createTodo(call, callback) {
    const todoItem = {
        id: todos.length + 1,
        text: call.request.text,
    };

    todos.push(todoItem);
    console.log(todoItem);
    callback(0, todoItem);
}

function readTodos(call, callback) {
    callback(0, { items: todos });
}

function readTodosStream(call, callback) {
    //write item into the client
    todos.forEach((t) => call.write(t));
    //end the communication/call when finished writing all the data
    call.end();
}

function main() {
    const server = new grpc.Server();

    server.addService(todoPackage.Todo.service, {
        createTodo: createTodo,
        readTodos: readTodos,
        readTodosStream: readTodosStream,
    });

    server.bindAsync(
        "localhost:50051",
        grpc.ServerCredentials.createInsecure(),
        (err, port) => {
            if (err) {
                console.log(`Error starting server on port ${port}: ${err}`);
            } else {
                console.log(`Listening on port : ${port}`);
                server.start();
            }
        }
    );
}

main();
