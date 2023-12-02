import PocketBase from "pocketbase";

const pb = new PocketBase("http://127.0.0.1:8090");

/**
 * Upload a new file on Pocketbase to a collection.
 *
 * @param collectionName Collection where the new file record will be stored. Normally, you have
 * a 'media' collection and use the records here as relations to columns on
 * other collections. Like a 'profilePicture' column on a 'users' collection.
 * @param file File you want to be uploaded to the collection. This will be added in the "file" column of the new record.
 *
 * @param title This will be added in the "title" column of the new record.
 *
 * @returns the new record on pocketbase where the file is uploaded.
 */
export default async function uploadFileUsingPocketbase(
  collectionName: string,
  file: File,
  title: string
) {
  const formData = new FormData();

  /**
   * @param name = "file" here is the column where you want the "File" type
   * is located.
   */
  formData.append("file", file);

  /**
   * Optionally, if since the 'media' record would have a 'title' column, also
   * add data there.
   */
  formData.append("title", title);

  const createdRecord = await pb.collection(collectionName).create(formData);

  return createdRecord;
}
