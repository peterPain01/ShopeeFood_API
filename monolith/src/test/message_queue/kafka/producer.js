const { Kafka } = require("kafkajs");

const kafka = new Kafka({
    clientId: "my-app",
    brokers: ["localhost:9092"],
});

const producer = kafka.producer();

const runProducer = async () => {
    await producer.connect();
    await producer.send({
        topic: "test-topic",
        messages: [{ value: "Hello KafkaJS user by Kafka Producer!" }],
    });

    await producer.disconnect();
};

runProducer.catch((err) => {
    console.log(err);
});
