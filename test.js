import Nhc from './exports/index.js'
// import 'nhc_dummy_api'
const nhc = new Nhc({host: '127.0.0.1'})

try {
  await nhc.connect()
  const actions = await nhc.listActions()
  console.log(actions);
  nhc.startEvents()
  nhc.on('listactions', (event) => {
    console.log(event.data);
    if (actions?.length > 0) process.exit(0)
    else process.exit(1)
  })
} catch (error) {
  console.log(error);
}



