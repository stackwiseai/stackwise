import PocketBase from "pocketbase";

const pb = new PocketBase("http://127.0.0.1:8090");

/** Get one record on pocketbase by id */
export default async function fetchPocketBaseRecord(
  collectionName: string,
  recordId: string
) {
  // or fetch a single 'example' collection record
  const record = await pb.collection(collectionName).getOne(recordId);

  return record;
}
