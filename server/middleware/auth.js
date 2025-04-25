var jwt=require('jsonwebtoken')


var REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
var ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;


function auth(req,res,next){
     try{

        var token=req.header('Authorization')

        if(!token)
        {
            return res.json({msg:'Invalid credentials !! '})


        }
        

        jwt.verify(token,ACCESS_TOKEN_SECRET,(err,user)=>
        {if(err)
        {
            res.status(400).json({msg:'invalid auth...'})
        }
        req.user=user
        next()
        }
    )


     }

     catch(error)
     {
        res.status(500).json({msg:error.message})
     }
}

module.exports = auth