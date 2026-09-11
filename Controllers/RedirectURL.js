import {URLs} from "../Models/url.js";


export const RedirectURL = async (req, res) => {
    const {shortId} = req.params;
    try{
const resUrls = await URLs.find({ shortId: shortId});
 const element = resUrls[0];
 res.redirect(element.longUrl);
}
    catch(err){
        res.status(500).json ({
            ok: false,
            err:err
        });
    }
};