

import express from "express";

// Setup MongoDB
import { MongoClient, ObjectId } from 'mongodb';

const app = express()
const PORT = 4000;

app.set('views', './views');
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))

// Setup MongoDB
const client = new MongoClient('mongodb://localhost:27017');
await client.connect();
const db = client.db('club');
const memberCollection = db.collection('members');

const newusers=[]

// get individul members
app.get('/individul', (req, res) => {
  res.render("individul",{})
})

// get all members
app.get('/member', async (req, res) => {
  const members = await memberCollection.find({}).toArray();
  res.render("members",{members:members})
})


app.get("/", async (req,res)=>{
    const members = await memberCollection.find({}).toArray();
    res.render("home",{members: members})
})

app.get('/newmember', (req, res) => {
    res.render("newmember",{mynewusers:newusers})
})

app.post('/newmember', async (req, res) => {
    await memberCollection.insertOne(req.body);
    res.redirect('/');
  });  
  
  // Who Is logdin

app.get('/newmember/:id', async (req, res) => {
    const theuser = await memberCollection.findOne({ _id: ObjectId(req.params.id) });
    res.render('member', {
      Name: theuser.name,
      Email: theuser.email,
      Telephon: theuser.tel,
      Data: theuser.date,
      Id: theuser._id
    });
  });

  

// Delete
app.get('/deletemember/:id', async (req, res) => {
  await memberCollection.deleteOne({ _id: ObjectId(req.params.id) });
  res.redirect('/member');
});


app.listen(PORT,()=>console.log(`Your port is listioning on: http://localhost:${PORT}`))


