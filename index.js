const express = require("express")
require('dotenv').config();
const port = 3000;
var app = express();

// Middleware para processar JSON
app.use(express.json());


const admin = require('firebase-admin');

const serviceAccount = {
    type: process.env.TYPE,
    project_id: process.env.PROJECT_ID,
    private_key_id: process.env.PRIVATE_KEY_ID,
    private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.CLIENT_EMAIL,
    client_id: process.env.CLIENT_ID,
    auth_uri: process.env.AUTH_URI,
    token_uri: process.env.TOKEN_URI,
    auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
    universe_domain: process.env.UNIVERSE_DOMAIN
};

console.log('serviceAccount:', serviceAccount)


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://personal-finance-82e1f-default-rtdb.firebaseio.com"
});

const db = admin.database();
const ref = db.ref('accounts');
const rootRef = db.ref();


app.listen(port, function () {
    console.log("Started application on port %d", port)
});

app.get("/", function (request, response) {
    response.status(200).send("Hello World!")
    // lerTodasCollections(rootRef).then((data) => {
    //     console.log('collections: ', data)
    //     response.status(200).json("Collections: ", data);
    // })

})

app.get("/accounts", function (request, response) {
    ref.on('value', (snapshot) => {
        response.status(200).send(snapshot.val());
    });
})


app.post("/new-account", function (request, response) {

    if (request.body) {
        ref.push({
            name: request.body.name,
            nickname: request.body.nickname,
            type: request.body.type,
            balance: request.body.balance
        });

        response.status(201).send("conta criada com sucesso!");
    }
})

// Função para ler todas as collections
async function lerTodasCollections(ref) {
    let collectionsArray = [];
    await ref.once('value', (snapshot) => {
        const collections = snapshot.val();

        // Itera pelas collections
        for (const collectionName in collections) {
            if (collections.hasOwnProperty(collectionName)) {
                console.log(`Collection: ${collectionName}`);
                collectionsArray.push(collectionName);

                // // Acessa os dados da collection
                // const collectionRef = ref.child(collectionName);
                // collectionRef.once('value', (collectionSnapshot) => {
                //     console.log(collectionSnapshot.val());
                // });
            }
        }
    });

    return collectionsArray;
}