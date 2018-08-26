import indexedDB from "@cachemap/indexed-db";
import localStorage from "@cachemap/local-storage";
import { run } from "../test-runner";

run(indexedDB, "indexedDB");
run(localStorage, "localStorage");
