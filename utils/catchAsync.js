module.exports= func=>{
    return (req,res,next)=>{
        func(req,res,next).catch(next);  //excepts a function func exeutes it and catches any error if there.
    }
}