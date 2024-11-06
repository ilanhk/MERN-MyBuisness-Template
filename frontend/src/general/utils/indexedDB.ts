export class IndDB {
  private dbName: string;
  private dbVersion: number;
  private db: IDBDatabase | null = null;

  static instance: IndDB = new IndDB("new-myBusiness-DB", 1);

  constructor(dbName: string, dbVersion: number) {
    this.dbName = dbName;
    this.dbVersion = dbVersion;
    this.initDB()
  }

  async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = (event: Event) => {
        const target = event.target as IDBRequest;
        console.error("Database error: " + target.error?.message);
        reject(target.error);
      };

      request.onsuccess = (event: Event) => {
        const target = event.target as IDBRequest;
        this.db = target.result as IDBDatabase;
        resolve();
      };

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBRequest).result as IDBDatabase;
        if (!db.objectStoreNames.contains("token")) {
          db.createObjectStore("token", { keyPath: "id" });
        }
      };
    });
  }

  async saveDataToDB(id: string, data: unknown) {
    if (!this.db) return;

    const transaction = this.db.transaction([id], "readwrite");
    const objectStore = transaction.objectStore(id);

    try {
      const request = objectStore.put({ id, data });

      request.onerror = (event: Event) => {
        const target = event.target as IDBRequest;
        console.error(`Error saving ${id} to IndexedDB: `, target.error);
      };

      transaction.oncomplete = () => {
        console.log(`${id} saved to IndexedDB`);
      };
    } catch (error) {
      console.error(`Error saving ${id} to IndexedDB: `, error);
    }
  }

  async getDataFromDB(id: string) {
    if (!this.db) return [];

    return new Promise((resolve, reject) => {
      const transaction = this.db?.transaction([id], "readonly");
      const objectStore = transaction?.objectStore(id);
      const request = objectStore?.getAll();

      if(request){
        request.onsuccess = (event: Event) => {
          const target = event.target as IDBRequest;
          resolve(target.result[0]?.data || []);
        };
  
        request.onerror = (event: Event) => {
          const target = event.target as IDBRequest;
          console.error(`Error retrieving ${id} from IndexedDB: `, target.error);
          reject(target.error);
        };
      };
    });
  }
}

