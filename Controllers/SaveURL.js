import { URLs } from "../Models/url.js";
import  { generateShortId }  from "../Utils/Keys.js";

export const SaveURL = async (req, res) =>{
const { longUrl } = req.body;
try{

const shortId = generateShortId(7);
const newURL = new URLs({longUrl: longUrl, shortId: shortId});
await newURL.save();

/* const shortURL = `http://localhost:5050/${shortId}`; */
// Protocol aur Host dynamically get karein taake Railway domain auto-detect ho jaye
    const host = req.get("host");
    const protocol = req.protocol;
    const shortURL = `${protocol}://${host}/${shortId}`;
res.status(200).json({


    ok: true,
    shortURL: shortURL,
    });

}catch(err){
console.log(err);
res.status(500).json({
        ok: false,
        err: err,

    });
}
};