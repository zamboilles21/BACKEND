const express = require('express');
const moment = require('moment');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = 5000;

app.use(express.urlencoded({ extended: true }));

const uri = "mongodb+srv://zamboilles21:Sandor123@cluster0.oc6usbx.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
    console.log('Connected to MongoDB Database...');
    const blogs = client.db("crud").collection("crudok");

    app.get('/blogs', (req, res) => {
        blogs.find().toArray()
            .then(results => {
                res.send(results)
            })
            .catch(error => {
                res.send(error)
            });
    });

    app.get('/blogs/:id', (req, res) => {
        let blogID = req.params.id;
        blogs.find({ "_id": ObjectId(blogID) }).toArray()
            .then(results => {
                res.send(results)
            })
            .catch(error => {
                res.send(error)
            });
    });

    app.post('/crudok', (req, res) => {
        let data = {
            title: req.body.title,
            description: req.body.description,
            date: moment(new Date).format('YYYY-MM-DD H:m:s')
        }
        blogs.insertOne(data)
            .then(results => {
                res.send(results)
            })
            .catch(error => {
                res.send(error)
            });
    });
    // UPDATE by ID
    app.patch('/crudok/:id',(req,res)=>{
        let blogID = req.params.id;
        let data = {
            title: req.body.title,
            description: req.body.description,
            date: moment(new Date).format('YYYY-MM-DD H:m:s')
        }
    })
    // client.close();
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}...`);
});