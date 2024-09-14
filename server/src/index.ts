import express,{Request,Response} from 'express'
import cors from 'cors'

const app = express();
const port = 5001;

app.use(cors());
app.use(express.json());

app.post('/api/message',(req:Request,res:Response)=>{
    const message = req.body.text;
    if(message){
        res.json({response:`${message} + Hello World!`})
    }else{
        return;
    }
})

app.listen(port,()=>{
    console.log(`Server is open on port ${port}`)
})