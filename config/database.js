module.exports = ({ env }) => ({
    connection: {
        client: 'postgres',
        connection: {
            connectionString: env('DATABASE_PRIVATE_URL')
        },
        pool: {
            min: env.int('DATABASE_POOL_MIN', 0),
            max: env.int('DATABASE_POOL_MAX', 10)
        },
        acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 60000)
    }
});