const Pool = require('pg').Pool;

const pool = new Pool({
    user: 'cigdb_user',
    password: 'NlyEDzvWnV1FpG1Dk8HoEFXHGb6VmALz',
    host: 'dpg-chekgljhp8ucm3vmrp8g-a.oregon-postgres.render.com',
    port: 5432,
    database: 'cigdb',
    ssl: true
});

module.exports = pool;