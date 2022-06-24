const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const loaderOptions = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
};

const PROTO_PATH = __dirname + "/exercise.proto";

const packageDefinition = protoLoader.loadSync(PROTO_PATH, loaderOptions);

const exercise = grpc.loadPackageDefinition(packageDefinition).exercise;

function greet(call, callback) {
    const { timestamp, name, randInt } = call.request;
    console.log("====Greet RPC invoked=====");
    console.log(`Received Data : ${timestamp},${name},${randInt}`);

    callback(
        { code: grpc.status.OK, message: "OK" },
        { message: "Hello " + name }
    );
}

function minusTen(call, callback) {
    const { timestamp, name, randInt } = call.request;
    console.log("====Minus Ten RPC invoked=====");
    console.log(`Received Data : ${timestamp},${name},${randInt}`);

    callback(
        { code: grpc.status.OK, message: "OK" },
        { message: JSON.stringify(randInt - 10) }
    );
}

function returnTimestamp(call, callback) {
    const { timestamp, name, randInt } = call.request;
    console.log("====Return Timestamp RPC invoked=====");
    console.log(`Received Data : ${timestamp},${name},${randInt}`);
    console.log(typeof timestamp, typeof name, typeof randInt);

    const d = new Date(0);
    d.setUTCMilliseconds(timestamp);

    callback(
        { code: grpc.status.OK, message: "OK" },
        { message: d.toLocaleString() }
    );
}

function main() {
    const server = new grpc.Server();
    server.addService(exercise.FirstService.service, {
        ReturnTimestamp: returnTimestamp,
        Greet: greet,
        MinusTen: minusTen,
    });

    server.bindAsync(
        "0.0.0.0:50051",
        grpc.ServerCredentials.createInsecure(),
        (err, port) => {
            if (err) {
                console.log(err);
            }
            server.start();
            console.log("listening on : " + port);
        }
    );
}

main();
