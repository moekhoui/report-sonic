import mongoose from 'mongoose'
import { MongoClient } from 'mongodb'

declare global {
  var mongoose: {
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
  }
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

