import Nhc from './exports/index.js'
// import 'nhc_dummy_api'
const nhc = new Nhc({host: '127.0.0.1'})

nhc.on('error', error => console.log(error))

try {
  const actions = await nhc.listActions()
} catch (error) {
  console.log(error);
}

nhc.on('listactions', (event) => {
  console.log(event.data);
  if (actions?.length > 0) process.exit(0)
  else process.exit(1)
})

