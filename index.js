const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0puja.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const chocolateCollection = client.db("chocolateDB").collection("chocolates");


    app.get('/chocolates', async(req, res)=>{
        const chocolates = await chocolateCollection.find().toArray();
        res.send(chocolates);
    })

    app.get('/chocolates/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await chocolateCollection.findOne(query);
        res.send(result)
    })

    app.post('/chocolates', async(req, res)=>{
        const newChocolate = req.body;
        const result = await chocolateCollection.insertOne(newChocolate);
        res.send(result);
    });

    app.put('/chocolates/:id', async(req, res)=> {
        const id = req.params.id;
        const chocolate = req.body;
        // console.log(id, chocolate);
        const filter = { _id : new ObjectId(id) };
        const options = { upsert: true };
        const updateChocolate = {
            $set: {
                name: chocolate.name,
                country: chocolate.country,
                category: chocolate.category,
                photo: chocolate.photo
            }
        }
        const result = await chocolateCollection.updateOne(filter, updateChocolate, options);
        res.send(result);
    })

    app.delete('/chocolates/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await chocolateCollection.deleteOne(query);
        res.send(result);
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




app.get('/', (req, res)=>{
    res.send("Chocolate Management System Server Running");
});

app.listen(port, ()=>{
    console.log(`Chocolate management server running on PORT: ${port}`);
});