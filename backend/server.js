import env from "./src/config/env.js"

import app from "./src/app.js"




app.listen(env.node_env_port, ()=>{
console.log(`Kuvam backend starting on ${env.node_env} mode on port ${env.node_env_port}.`)
})


