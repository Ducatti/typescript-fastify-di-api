import { buildServer } from '../presentation/http/server.js'
import { buildDependencies } from './container.js'

const app = await buildServer(buildDependencies())

await app.listen({ port: 3000, host: '0.0.0.0' })
