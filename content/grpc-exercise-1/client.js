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

function main() {
    const client = new exercise.FirstService(
        "0.0.0.0:50051",
        grpc.credentials.createInsecure()
    );

    const name = "Akmal";
    const timestamp = Date.now();
    const randInt = Math.floor(Math.random() * 100);

    client.minusTen(
        { timestamp: timestamp, name: name, randInt: randInt },
        (err, res) => {
            if (err) {
                console.log(err);
            } else {
                console.log(
                    `sent data: ${JSON.stringify({
                        timestamp: timestamp,
                        name: name,
                        randInt: randInt,
                    })}`
                );
                console.log(`received data : ${res.message}\n\n`);
            }
        }
    );

    client.greet(
        { timestamp: timestamp, name: name, randInt: randInt },
        (err, res) => {
            if (err) {
                console.log(err);
            } else {
                console.log(
                    `sent data: ${JSON.stringify({
                        timestamp: timestamp,
                        name: name,
                        randInt: randInt,
                    })}`
                );
                console.log(`received data : ${res.message}\n\n`);
            }
        }
    );

    client.returnTimestamp(
        { timestamp: timestamp, name: name, randInt: randInt },
        (err, res) => {
            if (err) {
                console.log(err);
            } else {
                console.log(
                    `sent data: ${JSON.stringify({
                        timestamp: timestamp,
                        name: name,
                        randInt: randInt,
                    })}`
                );
                console.log(`received data : ${res.message}\n\n`);
            }
        }
    );
}

main();
