const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000;
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');



// midelware 
app.use(express.json())
app.use(cors())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qu3bi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

        const database = client.db("review");
        const collectionreview = database.collection("collectionreview");


        // user server controll and store
        const databaseserver = client.db("review-server");
        const servercollection = databaseserver.collection("servercolleciton")

        app.get('/products', async (req, res) => {
            const couress = collectionreview.find()
            const result = await couress.toArray()
            res.send(result)
        })

        app.get('/products/:id', async (req, res) => {
            const id = req.params.id
            const quary = { _id: new ObjectId(id) }
            const result = await collectionreview.findOne(quary)
            res.send(result)
        })

        app.post('/products', async (req, res) => {
            const databody = req.body
            const result = await collectionreview.insertOne(databody)
            res.send(result)
        })

        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id
            const quary = { _id: new ObjectId(id) }
            const result = await collectionreview.deleteOne(quary)
            res.send(result)
        })

        app.put('/products/:id', async (req, res) => {
            const id = req.params.id
            const bodydata = req.body
            const quary = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const datareview = {
                $set: {
                    name: bodydata.name,
                    price: bodydata.price,
                    quantity: bodydata.quantity,
                    photo: bodydata.photo
                }
            }
            const result = await collectionreview.updateOne(quary, datareview, options)
            res.send(result)
        })


        // user store and control hare 
        app.get('/userserver', async (req, res) => {
            const quary = servercollection.find()
            const result = await quary.toArray()
            res.send(result)
        })


        app.post('/userserver', async (req, res) => {
            const databody = req.body
            const result = await servercollection.insertOne(databody)
            res.send(result)
        })




        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('this is a review for the world')
})

app.listen(port, () => {
    console.log(`review sarbat is redy port:${port}`)
})