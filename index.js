const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://crud:KYwhxLe1Jx370qIJ@cluster0.rwbdw2y.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const employeesCollection = client.db("employeeList").collection("employee");

        //insert employee details to database
        app.post('/insertem', async(req,res)=>{
            const employeeDetails = req.body;
            console.log(employeeDetails);
            const result = await employeesCollection.insertOne(employeeDetails);
            res.send(result);
        });

        //load data from database
        app.get('/allemployee',async (req,res)=>{
            const query = {};
            const cursor =  employeesCollection.find(query);
            const employees = await cursor.toArray();
            res.send(employees);
        });

        //delete query
        app.delete('/deleteemployee/:id',async (req,res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await employeesCollection.deleteOne(query);
            res.send(result);
        });

        //update the info
        app.put('/updateemployee/:id',async (req,res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const employeeDetails = req.body;
            const options = { upsert: true };
            const updateDoc = {
                $set:employeeDetails
            }
            const result = await employeesCollection.updateOne(query, updateDoc, options);
            res.send(result);
        });
    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello world');
});

app.listen(port, () => {
    console.log('Server is successfully running on the port', port);
});