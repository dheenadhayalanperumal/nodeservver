const express=require('express');
const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const userSchema=new Schema({
    firstname:{
        type:String,
        required:true
        
    },
    lastname:{
        type:String,
        required:false
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phonenumber:{
        type:Number
    }
})

const User = mongoose.model('User', userSchema);
const app=express();
const port=8000;
app.use(express.json())

mongoose.connect('mongodb+srv://dheenadhayalan:9gTW3TEnvb1Ly61v@zaara.fqrbo6l.mongodb.net/?retryWrites=true&w=majority')
.then(()=>console.log("Mangodb is connected"))
.catch(err=>console.log("mangodb coonection has some problem"))


app.get('/users', (req, res) => {
    User.find()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => {
            console.error('Error retrieving users:', err);
            res.status(500).send('Internal Server Error');
        });
});


app.post('/users', (req, res) => {
    const { firstname, lastname, email, phonenumber } = req.body;
  
    // Create a new instance of the User model
    const newUser = new User({
      firstname,
      lastname,
      email,
      phonenumber
    });
  
    // Save the user to the database
    newUser.save()
      .then(user => {
        console.log('User saved:', user);
        res.status(201).json(user); // Send the saved user as a response
      })
      .catch(err => {
        console.error('Error saving user:', err);
        res.status(500).send('Internal Server Error');
      });
  });


  app.get('/users/search', (req, res) => {
    const { firstname } = req.query;

    if (!firstname) {
        return res.status(400).send('Bad Request: Missing firstname parameter');
    }

    User.find({ firstname })
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => {
            console.error('Error searching for user:', err);
            res.status(500).send('Internal Server Error');
        });
});



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });

