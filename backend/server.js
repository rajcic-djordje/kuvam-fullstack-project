import env from "./src/config/env.js"

import app from "./src/app.js"




app.listen(env.nodePort, ()=>{
console.log(`Kuvam backend starting on ${env.nodeEnv} mode on port ${env.nodePort}.`)
})


