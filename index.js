const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

// ............................................................................................................................................................
// Mongo start.................................................................................................................................................
const uri = "mongodb+srv://r_and_f_admin:helloworldadmin@cluster0.8ydx2m5.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
run().catch(console.dir);
// Mongo end...................................................................................................................................................
// ............................................................................................................................................................


app.get('/', (req, res) => {
    res.send('R&F is currently running')
})

app.listen(port, () => {
    console.log(`R&F is currently running on port ${port}`);
})