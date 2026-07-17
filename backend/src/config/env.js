const node_env = process.env.NODE_ENV

const allowed_values = ["development", "test", "production"]

if (node_env==undefined || allowed_values.find(x => x == node_env) == undefined)
    throw new Error("Mode not allowed!")

const env = {
    node_env
}

export default env



