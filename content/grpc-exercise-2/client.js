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

const text = process.argv[2];

function main() {
    const client = new todoPackage.Todo(
        "localhost:50051",
        grpc.credentials.createInsecure()
    );

    client.createTodo({ id: null, text: text }, (err, res) => {
        if (err) {
            console.log(err);
        } else {
            console.log(res);
        }
    });

    // client.readTodos({}, (err, res) => {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         console.log("Received from server : ", res);

    //         res.items.forEach((i) => {
    //             console.log("the id is ", i.id);
    //         });
    //     }
    // });

    const call = client.readTodosStream();
    call.on("data", (item) => {
        console.log("received item from server ", item);
    });

    call.on("end", (e) => {
        console.log("server done streaming!");
    });
}

main();
