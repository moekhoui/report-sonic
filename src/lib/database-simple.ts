// Simple in-memory database for development and testing
// This can be replaced with a real MongoDB connection later

interface DatabaseRecord {
  _id: string;
  [key: string]: any;
}

class SimpleDatabase {
  private collections: Map<string, Map<string, DatabaseRecord>> = new Map();

  getCollection(name: string) {
    if (!this.collections.has(name)) {
      this.collections.set(name, new Map());
    }
    return this.collections.get(name)!;
  }

  async insertOne(collectionName: string, document: any) {
    const collection = this.getCollection(collectionName);
    const id = Math.random().toString(36).substr(2, 9);
    const doc = { _id: id, ...document };
    collection.set(id, doc);
    return { insertedId: id };
  }

  async findOne(collectionName: string, query: any) {
    const collection = this.getCollection(collectionName);
    for (const [id, doc] of collection) {
      if (this.matchesQuery(doc, query)) {
        return doc;
      }
    }
    return null;
  }

  async find(collectionName: string, query: any = {}) {
    const collection = this.getCollection(collectionName);
    const results = [];
    for (const [id, doc] of collection) {
      if (this.matchesQuery(doc, query)) {
        results.push(doc);
      }
    }
    return results;
  }

  async updateOne(collectionName: string, query: any, update: any) {
    const collection = this.getCollection(collectionName);
    for (const [id, doc] of collection) {
      if (this.matchesQuery(doc, query)) {
        const updatedDoc = { ...doc, ...update };
        collection.set(id, updatedDoc);
        return { modifiedCount: 1 };
      }
    }
    return { modifiedCount: 0 };
  }

  async deleteOne(collectionName: string, query: any) {
    const collection = this.getCollection(collectionName);
    for (const [id, doc] of collection) {
      if (this.matchesQuery(doc, query)) {
        collection.delete(id);
        return { deletedCount: 1 };
      }
    }
    return { deletedCount: 0 };
  }

  private matchesQuery(doc: any, query: any): boolean {
    for (const [key, value] of Object.entries(query)) {
      if (doc[key] !== value) {
        return false;
      }
    }
    return true;
  }
}

// Global database instance
const db = new SimpleDatabase();

export default db;
