export class IndDB {
    constructor(dbName, dbVersion) {
        this.db = null;
        this.dbName = dbName;
        this.dbVersion = dbVersion;
        this.initDB();
    }
    async initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);
            request.onerror = (event) => {
                var _a;
                const target = event.target;
                console.error("Database error: " + ((_a = target.error) === null || _a === void 0 ? void 0 : _a.message));
                reject(target.error);
            };
            request.onsuccess = (event) => {
                const target = event.target;
                this.db = target.result;
                resolve();
            };
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains("token")) {
                    db.createObjectStore("token", { keyPath: "id" });
                }
            };
        });
    }
    async saveDataToDB(id, data) {
        if (!this.db)
            return;
        const transaction = this.db.transaction([id], "readwrite");
        const objectStore = transaction.objectStore(id);
        try {
            const request = objectStore.put({ id, data });
            request.onerror = (event) => {
                const target = event.target;
                console.error(`Error saving ${id} to IndexedDB: `, target.error);
            };
            transaction.oncomplete = () => {
                console.log(`${id} saved to IndexedDB`);
            };
        }
        catch (error) {
            console.error(`Error saving ${id} to IndexedDB: `, error);
        }
    }
    async getDataFromDB(id) {
        if (!this.db)
            return [];
        return new Promise((resolve, reject) => {
            var _a;
            const transaction = (_a = this.db) === null || _a === void 0 ? void 0 : _a.transaction([id], "readonly");
            const objectStore = transaction === null || transaction === void 0 ? void 0 : transaction.objectStore(id);
            const request = objectStore === null || objectStore === void 0 ? void 0 : objectStore.getAll();
            if (request) {
                request.onsuccess = (event) => {
                    var _a;
                    const target = event.target;
                    resolve(((_a = target.result[0]) === null || _a === void 0 ? void 0 : _a.data) || []);
                };
                request.onerror = (event) => {
                    const target = event.target;
                    console.error(`Error retrieving ${id} from IndexedDB: `, target.error);
                    reject(target.error);
                };
            }
            ;
        });
    }
}
IndDB.instance = new IndDB("new-myBusiness-DB", 1);
