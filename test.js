import Nhc from './exports/index.js'
import 'nhc_dummy_api'
const nhc = new Nhc({host: '127.0.0.1'})

const actions = await nhc.listActions()
if (actions?.length > 0) process.exit(0)
else process.exit(1)