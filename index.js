const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

console.log(process.env.DB_USER);
console.log(process.env.DB_PASS);

// ............................................................................................................................................................
// Mongo start.................................................................................................................................................
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8ydx2m5.mongodb.net/?retryWrites=true&w=majority`;

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
        // await client.connect();

        const productCollection = client.db("randf").collection("products");
        const cartCollection = client.db("randf").collection("addedcart");

        // CRUD operation section

        // POST from add product
        app.post("/addnewproduct/", async (req, res) => {
            const getProduct = req.body;
            // console.log(getProduct);
            const result = await productCollection.insertOne(getProduct);
            res.send(result)
        })

        app.post("/cart", async (req, res) => {
            const myCart = req.body;
            // console.log(myCart);
            const result = await cartCollection.insertOne(myCart);
            res.send(result)
        })

        // get added product
        app.get("/brands/:name", async (req, res) => {
            const name = req.params.name;
            // console.log(name);
            const filter = { brand: name }
            const cursor = productCollection.find(filter);
            const result = await cursor.toArray();
            res.send(result)
        })

        // get single added product
        app.get("/products/:product", async (req, res) => {
            const product = req.params.product;
            const filter = { product: product }
            const cursor = productCollection.find(filter);
            const result = await cursor.toArray();
            res.send(result)
        })

        // cart info get
        app.get("/mycart/:name", async (req, res) => {
            const name = req.params.name;
            const filter = {email:name};
            const cursor = cartCollection.find(filter);
            const result = await cursor.toArray();
            res.send(result);
        })

        // get updated product
        app.get("/update/:product", async (req, res) => {
            const product = req.params.product;
            const filter = {product : product}
            const result = await productCollection.findOne(filter)
            // console.log(result);
            res.send(result);
        })

        app.delete("/mycart/:id", async (req, res) => {
            const name=req.params.id;
            console.log(name);
            const filter = {_id : new ObjectId(name)};
            const result = await cartCollection.deleteOne(filter)
            res.send(result);
        })

        // update added data
        app.put("/update/:product", async (req, res) => {
            const product = req.params.product;
            const body = req.body;
            const filter = {product : product};
            const options = { upsert: true }
            const updateDoc = {
                $set : {
                    product: body.product, brand: body.brand, type: body.type, price: body.price, rating: body.rating, photo: body.photo, description: body.description
                }
            }
            const result = await productCollection.updateOne(filter, updateDoc, options )
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
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