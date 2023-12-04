# Manage indexes

## Getting information on your indexes

List all your Pinecone indexes:

```js
await pinecone.listIndexes();
```

Get the configuration and current status of an index named "example-index":

```js
await pinecone.describeIndex('example-index');
```

## Creating an index

The simplest way to create an index is as follows. This gives you an index with a single pod that will perform approximate nearest neighbor (ANN) search using cosine similarity:

```js
await pinecone.createIndex({
  name: 'example-index',
  dimension: 128,
});
```

A more complex index can be created as follows. This creates an index that measures similarity by Euclidean distance and runs on 4 s1 (storage-optimized) pods of size x1:

```js
await pinecone.createIndex({
  name: 'example-index',
  dimension: 128,
  metric: 'euclidean',
  pods: 4,
  podType: 's1.x1',
});
```

## Create an index from a collection

To create an index from a collection, use the create_index operation and provide a source_collection parameter containing the name of the collection from which you wish to create an index. The new index is queryable and writable.

Creating an index from a collection generally takes about 10 minutes. Creating a p2 index from a collection can take several hours when the number of vectors is on the order of 1M.

### Example

The following example creates an index named example-index with 128 dimensions from a collection named example-collection.

```js
await pinecone.createIndex({
  name: 'example-index',
  dimension: 128,
  sourceCollection: 'example-collection',
});
```

For more information about each pod type and size, see Indexes.

For the full list of parameters available to customize an index, see the create_index API reference.

## Changing pod sizes

The default pod size is x1. After index creation, you can increase the pod size for an index.

Increasing the pod size of your index does not result in downtime. Reads and writes continue uninterrupted during the scaling process. Currently, you cannot reduce the pod size of your indexes. Your number of replicas and your total number of pods remain the same, but each pod changes size. Resizing completes in about 10 minutes.

To learn more about pod sizes, see Indexes.

## Increasing the pod size for an index

To change the pod size of an existing index, use the configure_index operation and append the new size to the pod_type parameter, separated by a period (.).

Projects in the gcp-starter environment do not use pods.

### Example

The following example assumes that example-index has size x1 and changes the size to x2.

```js
await client.configureIndex('example-index', {
  podType: 's1.x2',
});
```

## Checking the status of a pod size change

To check the status of a pod size change, use the describe_index operation. The status field in the results contains the key-value pair "state":"ScalingUp" or "state":"ScalingDown" during the resizing process and the key-value pair "state":"Ready" after the process is complete.

The index fullness metric provided by describe_index_stats may be inaccurate until the resizing process is complete.

### Example

The following example uses describe_index to get the index status of the index example-index. The status field contains the key-value pair "state":"ScalingUp", indicating that the resizing process is still ongoing.

```js
await pinecone.describeIndex({
  name: 'example-index',
});
```

## Replicas

You can increase the number of replicas for your index to increase throughput (QPS). All indexes start with replicas=1.

Indexes in the gcp-starter environment do not support replicas.

### Example

The following example uses the configure_index operation to set the number of replicas for the index example-index to 4.

```js
await pinecone.configureIndex('example-index', {
  replicas: 4,
});
```

See the configure_index API reference for more details.

## Selective metadata indexing

By default, Pinecone indexes all metadata. When you index metadata fields, you can filter vector search queries using those fields. When you store metadata fields without indexing them, you keep memory utilization low, especially when you have many unique metadata values, and therefore can fit more vectors per pod.

Searches without metadata filters do not consider metadata. To combine keywords with semantic search, see sparse-dense embeddings.

When you create a new index, you can specify which metadata fields to index using the metadata_config parameter. Projects on the gcp-starter environment do not support the metadata_config parameter.

### Example

```js
await pinecone.createIndex({
  name: 'example-index',
  dimension: 128,
  metadata_config: {
    indexed: ['metadata-field-name'],
  },
});
```

The value for the metadata_config parameter is a JSON object containing the names of the metadata fields to index.

```JSON
{
"indexed": [
"metadata-field-1",
"metadata-field-2",
"metadata-field-n"
]
}
```

When you provide a metadata_config object, Pinecone only indexes the metadata fields present in that object: any metadata fields absent from the metadata_config object are not indexed.

When a metadata field is indexed, you can filter your queries using that metadata field; if a metadata field is not indexed, metadata filtering ignores that field.

## Examples

The following example creates an index that only indexes the genre metadata field. Queries against this index that filter for the genre metadata field may return results; queries that filter for other metadata fields behave as though those fields do not exist.

```js
await pinecone.createIndex({
  name: 'example-index',
  dimension: 128,
  metadata_config: {
    indexed: ['genre'],
  },
});
```

## Deleting an index

This operation will delete all of the data and the computing resources associated with the index.

### Note

When you create an index, it runs as a service until you delete it. Users are
billed for running indexes, so we recommend you delete any indexes you're not
using. This will minimize your costs.

Delete a Pinecone index named "pinecone-index":

```js
await pinecone.deleteIndex('example-index');
```

# Back up indexes

## Overview

This document describes how to make backup copies of your indexes using collections.

To learn how to create an index from a collection, see Manage indexes.

## Create a backup using a collection

To create a backup of your index, use the create_collection operation. A collection is a static copy of your index that only consumes storage.

### Example

The following example creates a collection named example-collection from an index named example-index.

```js
await pinecone.createCollection({
  name: 'example-collection',
  source: 'example-index',
});
```

## Check the status of a collection

To retrieve the status of the process creating a collection and the size of the collection, use the describe_collection operation. Specify the name of the collection to check. You can only call describe_collection on a collection in the current project.

The describe_collection operation returns an object containing key-value pairs representing the name of the collection, the size in bytes, and the creation status of the collection.

### Example

The following example gets the creation status and size of a collection named example-collection.

```js
await pinecone.describeCollection('example-collection');
```

## List your collections

To get a list of the collections in the current project, use the list_collections operation.

### Example

The following example gets a list of all collections in the current project.

```js
await pinecone.listCollections();
```

## Delete a collection

To delete a collection, use the delete_collection operation. Specify the name of the collection to delete.

Deleting the collection takes several minutes. During this time, the describe_collection operation returns the status "deleting".

### Example

The following example deletes the collection example-collection.

```js
await pinecone.deleteCollection('example-collection');
```

# Managing data

In addition to inserting and querying data, there are other ways you can interact with vector data in a Pinecone index. This section walks through the various vector operations available.

## Create a client instance

If you're using a Pinecone client library to access an index, you'll need to create a client instance:

```js
import { Pinecone } from '@pinecone-database/pinecone';

const pinecone = new Pinecone({
  apiKey: 'YOUR_API_KEY',
  environment: 'YOUR_ENVIRONMENT',
});
const index = pinecone.index('pinecone-index');
```

## Specify an index endpoint

Pinecone indexes each have their own DNS endpoint. For cURL and other direct
API calls to a Pinecone index, you'll need to know the dedicated endpoint for
your index.

Index endpoints take the following form:

https://$INDEX_NAME-$PINECONE_PROJECT_ID.svc.$PINECONE_ENVIRONMENT.pinecone.io

$INDEX_NAME is the name you gave your index when you created it.
$PINECONE_PROJECT_ID is the Pinecone project id that your API key is associated
with. This can be retrieved using the whoami operation below.
$PINECONE_ENVIRONMENT is the cloud region for your Pinecone project.

## Call whoami to retrieve your project id.

The following command retrieves your Pinecone project id.

```curl
PINECONE_ENVIRONMENT='your-environment'
PINECONE_API_KEY='your-api-key'

curl "https://controller.$PINECONE_ENVIRONMENT.pinecone.io/actions/whoami" \
 -H "Api-Key: $PINECONE_API_KEY"
```

## Describe index statistics

Get statistics about an index, such as record count per namespace:

```js
const indexStats = await index.describeIndexStats();
```

## Fetching records

The Fetch operation looks up and returns records, by id, from an index. The returned records include the vector values and/or metadata. Typical fetch latency is under 5ms.

Fetch records by their ids:

```js
const fetchResult = await index.fetch(['id-1', 'id-2']);
// Returns:
// {'namespace': '',
// 'records': {'id-1': {'id': 'id-1',
// 'values': [0.568879, 0.632687092, 0.856837332, ...]},
// 'id-2': {'id': 'id-2',
// 'values': [0.00891787093, 0.581895, 0.315718859, ...]}}}
```

## Updating records

There are two methods for updating records and metadata, using full or partial updates.

### Full update

Full updates modify the entire record, including vector values and metadata. Updating a record by id is done the same way as inserting records. (Write operations in Pinecone are idempotent.)

The Upsert operation writes records into an index.

#### Note

If a new value is upserted for an existing vector id, it will overwrite the
previous value.

Update the value of the record ("id-3", [3.3, 3.3]):

```js
await index.upsert([{ id: '3', values: [3.3, 3.3] }]);
```

Fetch the record again. We should get ("id-3", [3.3, 3.3]):

```js
await index.fetch(['id-3']);
```

### Partial update

The Update operation performs partial updates that allow changes to part of a record. Given an ID, we can update the vector value with the values argument or update metadata with the set_metadata argument.

#### Warning

The Update operation does not validate the existence of ids within an
index. If a non-existent id is given then no changes are made and a 200 OK
will be returned.

To update the vector values of record ("id-3", [3.0, 3.0], {"type": "doc", "genre": "drama"}):

```js
await index.update({
  id: 'id-3',
  values: [4.0, 2.0],
});
```

The updated record would now be ("id-3", [4.0, 2.0], {"type": "doc", "genre": "drama"}). Values have been updated but the metadata is unchanged.

When updating metadata only specified fields will be modified. If a specified field does not exist, it is added.

#### Note

Metadata updates apply only to fields passed to the set_metadata
argument. Any other fields will remain unchanged.

To update the metadata of record ("id-3", [4.0, 2.0], {"type": "doc", "genre": "drama"}), use code like the following:

```js
// Update the metadata
await index.update({
  id: 'id-3',
  metadata: {
    type: 'web',
    new: true,
  },
});
// View the updated results

const fetchResults = await index.fetch(['id-3']);
console.log(fetchResults.records['id-3']);
```

The updated record would now be ("id-3", [4.0, 2.0], {"type": "web", "genre": "drama", "new": true}). The type metadata field has been updated to web, the new property has been added with value true, and the genre property has been unchanged.

Both vector and metadata can be updated at once by including both values and metadata arguments. To update both these parts of the "id-3" record we write:

```js
await index.update({
  id: 'id-3',
  values: [1.0, 2.0],
  metadata: {
    type: 'webdoc',
  },
});
```

The updated record would now be ("id-3", [1.0, 2.0], {"type": "webdoc", "genre": "drama", "new": true}).

## Deleting records

The Delete operation deletes records from an index.

Alternatively, it can also delete all records from an index or namespace.

When deleting large numbers of records, limit the scope of delete operations to hundreds of records per operation.

Instead of deleting all records in an index, delete the index and recreate it.

### Delete records by ID

#### Example

```js
const ns = index.namespace('example-namespace');
// Delete one record by ID.
await ns.deleteOne('id-1');
// Delete more than one record by ID.
await ns.deleteMany(['id-2', 'id-3']);
```

## Delete records by namespace

To delete all records from a namespace, specify the appropriate parameter for your client and provide a
namespace parameter.

### Note

If you delete all records from a single namespace, it will also delete the
namespace.

Projects on the gcp-starter environment do not support deleting records by namespace.

### Example:

```js
await index.namespace('example-namespace').deleteAll();
```

# Insert data

After creating a Pinecone index, you can start inserting vector embeddings and metadata into the index.

## Inserting records

Create a client instance and target an index:

```js
const records = [
  {
    id: 'A',
    values: [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
  },
  {
    id: 'B',
    values: [0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2],
  },
  {
    id: 'C',
    values: [0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3],
  },
  {
    id: 'D',
    values: [0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4],
  },
  {
    id: 'E',
    values: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
  },
];

await index.upsert(records);
```

Immediately after the upsert response is received, records may not be visible to queries yet. This is because Pinecone is eventually consistent. In most situations, you can check if the records have been received by checking for the record counts returned by describe_index_stats() to be updated. Keep in mind that if you have multiple replicas, they may not all become consistent at the same time.

```js
await index('index-name').describeIndexStats();
```

## Partitioning an index into namespaces

You can organize the records added to an index into partitions, or "namespaces," to limit queries and other vector operations to only one such namespace at a time. For more information, see: Namespaces.

## Inserting records with metadata

You can insert records that contain metadata as key-value pairs.

You can then use the metadata to filter for those criteria when sending the query. Pinecone will search for similar vector embeddings only among those items that match the filter. For more information, see: Metadata Filtering.

```js
const records = [
  {
    id: 'A',
    values: [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
    metadata: { genre: 'comedy', year: 2020 },
  },
  {
    id: 'B',
    values: [0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2],
    metadata: { genre: 'documentary', year: 2019 },
  },
  {
    id: 'C',
    values: [0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3],
    metadata: { genre: 'comedy', year: 2019 },
  },
  {
    id: 'D',
    values: [0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4],
    metadata: { genre: 'drama' },
  },
  {
    id: 'E',
    values: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
    metadata: { genre: 'drama' },
  },
];

await index.upsert(records);
```

## Upserting records with sparse values

Sparse vector values can be upserted alongside dense vector values.

```js
index = pinecone.index('example-index');

await index.upsert([
  {
    id: 'vec1',
    values: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8],
    sparseValues: {
      indices: [1, 5],
      values: [0.5, 0.5],
    },
    metadata: { genre: 'drama' },
  },
  {
    id: 'vec2',
    values: [0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9],
    metadata: { genre: 'action' },
    sparseValues: {
      indices: [5, 6],
      values: [0.4, 0.5],
    },
  },
]);
```

### Limitations

The following limitations apply to upserting records with sparse vectors:

You cannot upsert a record with sparse vector values without dense vector values.
Only s1 and p1 pod types using the dotproduct metric support querying sparse vectors. There is no error at upsert time: if you attempt to query any other pod type using sparse vectors, Pinecone returns an error.
You can only upsert sparse vector values of sizes up to 1000 non-zero values.
Indexes created before February 22, 2023 do not support sparse values.

## Troubleshooting index fullness errors

When upserting data, you may receive the following error:

```console
Index is full, cannot accept data.
```

New upserts may fail as the capacity becomes exhausted. While your index can still serve queries, you need to scale your environment to accommodate more vectors.

To resolve this issue, you can scale your index.

# Query data

After your data is indexed, you can start sending queries to Pinecone.

The Query operation searches the index using a query vector. It retrieves the IDs of the most similar records in the index, along with their similarity scores. This operation can optionally return the result's vector values and metadata, too. You specify the number of vectors to retrieve each time you send a query. Matches are always ordered by similarity from most similar to least similar.

The similarity score for a vector represents its distance to the query vector, calculated according to the distance metric for the index. The significance of the score depends on the similarity metric. For example, for indexes using the euclidean distance metric, scores with lower values are more similar, while for indexes using the dotproduct metric, higher scores are more similar.

## Sending a query

When you send a query, you provide vector values representing your query embedding. The top_k parameter indicates the number of results to return. For example, this example sends a query vector and retrieves three matching vectors:

```js
const queryResponse = await index.query({
  vector: [0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3],
  topK: 3,
  includeValues: true,
});
// Returns:
// {
//   matches: [
//             {
//               id: 'C',
//               score: 0.000072891,
//               values: [0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3]
//             },
//             {
//               id: 'B',
//               score: 0.080000028,
//               values: [0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2]
//             },
//             {
//               id: 'D',
//               score: 0.0800001323,
//               values: [0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4]
//             }
//           ],
//   namespace: ''
// }
```

Depending on your data and your query, you may get fewer than top_k results. This happens when top_k is larger than the number of possible matching vectors for your query.

## Querying by namespace

You can organize the records added to an index into partitions, or "namespaces," to limit queries and other vector operations to only one such namespace at a time. For more information, see: Namespaces.

## Using metadata filters in queries

You can add metadata to document embeddings within Pinecone, and then filter for those criteria when sending the query. Pinecone will search for similar vector embeddings only among those items that match the filter. For more information, see: Metadata Filtering.

```js
const index = pinecone.index('example-index');
const queryResponse = await index.query({
  vector: [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
  topK: 1,
  includeMetadata: true,
  filter: {
    genre: { $eq: 'documentary' },
  },
});
```

## Querying vectors with sparse and dense values

When querying an index containing sparse and dense vectors, include a sparse_vector in your query parameters.

### Examples

The following example shows how to query with a sparse-dense vector.

```js
const queryResponse = await index.namespace('example-namespace').query({
topK: 10,
vector: [0.1, 0.2, 0.3, 0.4],
sparseVector: {
indices: [3]
values: [0.8]
}
})
```

To learn more, see Querying sparse-dense vectors.

## Limitations

Avoid returning vector data and metadata when top_k is greater than 1000. This means queries with top_k over 1000 should not contain include_metadata=True or include_data=True. For more limitations, see: Limits.

Pinecone is eventually consistent, so queries may not reflect very recent upserts.

# Using namespaces

Pinecone allows you to partition the records in an index into namespaces.\* Queries and other operations are then limited to one namespace, so different requests can search different subsets of your index.

For example, you might want to define a namespace for indexing articles by content, and another for indexing articles by title. For a complete example, see our Namespaces example notebook.

Every index is made up of one or more namespaces. Every record exists in exactly one namespace.

Namespaces are uniquely identified by a namespace name, which almost all operations accept as a parameter to limit their work to the specified namespace. When you don't specify a namespace name for an operation, Pinecone uses the default namespace name of "" (the empty string).

\*Note: Projects in the gcp-starter environment do not currently support namespaces.

## Creating a namespace

Namespaces are created automatically the first time they are used to upsert records. If the namespace doesn't exist, it is created implicitly.

The example below will create a "my-first-namespace" namespace if it doesn’t already exist:

```js
// Create a client instance scoped to perform all operations
// within that namespace.
const ns1 = index.namespace('my-first-namespace');
await ns1.upsert([
  {
    id: 'id-1',
    values: [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
  },
]);
```

Then you can submit queries and other operations specifying that namespace as a parameter. For example, to query the records in namespace "my-first-namespace" use code like the following:

```js
const ns1 = index.namespace('my-first-namespace');
await ns1.query({
  topK: 1,
  vector: [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
});
```

## Creating more than one namespace

You can create more than one namespace. For example, insert data into separate namespaces:

```js
// First, set up some records. In a real use case, the vector values in these records would probably be outputs of an embedding model.
const records = [
  {
    id: 'id-1',
    values: [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
  },
];

// Calling upsert on the 'nsA' client instance upserts to the namespace 'namespace_a'.
const nsA = index.namespace('namespace_a');
await nsA.upsert(recordsA);

// If we perform another operation like fetch with this client instance, it will also execute within the namespace 'namespace_a' and the record should be found and returned.
const fetchResult = await nsA.fetch(['id-1']);
console.log(fetchResult.records['id-1'] !== undefined); // true
console.log(fetchResult.namespace === 'namespace_a'); // true

// If we execute the same command with the client instance scoped to a different namespace, such as `namespace_b`, then no records should be found by fetch when looking for the id `id-1`.
const fetchResult2 = await index.namespace('namespace_b').fetch(['id-1']);
console.log(fetchResult2.records['id-1'] !== undefined); // false because no data returned by fetch
```

## Operations across all namespaces

All vector operations apply to a single namespace, with one exception:

The DescribeIndexStatistics operation returns per-namespace statistics about the contents of all namespaces in an index.

# Filtering with metadata

You can limit your vector search based on metadata. Pinecone lets you attach metadata key-value pairs to vectors in an index, and specify filter expressions when you query the index.

Searches with metadata filters retrieve exactly the number of nearest-neighbor results that match the filters. For most cases, the search latency will be even lower than unfiltered searches.

Searches without metadata filters do not consider metadata. To combine keywords with semantic search, see sparse-dense embeddings.

## Supported metadata types

You can associate a metadata payload with each vector in an index, as key-value pairs in a JSON object where keys are strings and values are one of:

- String
- Number (integer or floating point, gets converted to a 64 bit floating point)
- Booleans (true, false)
- List of String

### Note

High cardinality consumes more memory: Pinecone indexes metadata to allow
for filtering. If the metadata contains many unique values — such as a unique
identifier for each vector — the index will consume significantly more
memory. Consider using selective metadata indexing to avoid indexing
high-cardinality metadata that is not needed for filtering.

### Warning

Null metadata values are not supported. Instead of setting a key to hold a
null value, we recommend you remove that key from the metadata payload.

For example, the following would be valid metadata payloads:

```JSON
{
    "genre": "action",
    "year": 2020,
    "length_hrs": 1.5
}

{
    "color": "blue",
    "fit": "straight",
    "price": 29.99,
    "is_jeans": true
}
```

## Supported metadata size

Pinecone supports 40kb of metadata per vector.

## Metadata query language

### Note

Pinecone's filtering query language is based on MongoDB's query and projection operators. We
currently support a subset of those selectors.

The metadata filters can be combined with AND and OR:

$eq - Equal to (number, string, boolean)
$ne - Not equal to (number, string, boolean)
$gt - Greater than (number)
$gte - Greater than or equal to (number)
$lt - Less than (number)
$lte - Less than or equal to (number)
$in - In array (string or number)
$nin - Not in array (string or number)

### Using arrays of strings as metadata values or as metadata filters

A vector with metadata payload...

```JSON
{ "genre": ["comedy", "documentary"] }
```

...means the "genre" takes on both values.

For example, queries with the following filters will match the vector:

```JSON
{"genre":"comedy"}

{"genre": {"$in":["documentary","action"]}}

{"$and": [{"genre": "comedy"}, {"genre":"documentary"}]}
```

Queries with the following filter will not match the vector:

```JSON
{ "$and": [{ "genre": "comedy" }, { "genre": "drama" }] }
```

And queries with the following filters will not match the vector because they are invalid. They will result in a query compilation error:

```
// INVALID QUERY:

{"genre": ["comedy", "documentary"]}
```

```
# INVALID QUERY:

{"genre": {"$eq": ["comedy", "documentary"]}}
```

## Inserting metadata into an index

Metadata can be included in upsert requests as you insert your vectors.

For example, here's how to insert vectors with metadata representing movies into an index:

```js
await index.upsert({
  vectors: [
    {
      id: 'A',
      values: [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
      metadata: { genre: 'comedy', year: 2020 },
    },
    {
      id: 'B',
      values: [0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2],
      metadata: { genre: 'documentary', year: 2019 },
    },
    {
      id: 'C',
      values: [0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3],
      metadata: { genre: 'comedy', year: 2019 },
    },
    {
      id: 'D',
      values: [0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4],
      metadata: { genre: 'drama' },
    },
    {
      id: 'E',
      values: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
      metadata: { genre: 'drama' },
    },
  ],
});
```

Projects on the gcp-starter environment do not support metadata strings containing the character Δ.

## Querying an index with metadata filters

Metadata filter expressions can be included with queries to limit the search to only vectors matching the filter expression.

For example, we can search the previous movies index for documentaries from the year 2019. This also uses the include_metadata flag so that vector metadata is included in the response.

### Warning

For performance reasons, do not return vector data and metadata when
top_k>1000. Queries with top_k over 1000 should not contain
include_metadata=True or include_data=True.

```js
const queryResponse = await index.query({
  vector: [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
  filter: { genre: { $in: ['comedy', 'documentary', 'drama'] } },
  topK: 1,
  includeMetadata: true,
});
console.log(queryResponse.data);
// Returns:
// {'matches': [{'id': 'B',
// 'metadata': {'genre': 'documentary', 'year': 2019.0},
// 'score': 0.0800000429,
// 'values': []}],
// 'namespace': ''}
```

```curl
curl -i -X POST https://YOUR_INDEX-YOUR_PROJECT.svc.YOUR_ENVIRONMENT.pinecone.io/query \
 -H 'Api-Key: YOUR_API_KEY' \
 -H 'Content-Type: application/json' \
 -d '{
"vector": [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
"filter": {"genre": {"$in": ["comedy", "documentary", "drama"]}},
"topK": 1,
"includeMetadata": true
}'
# Output:
# {
# "matches": [
# {
# "id": "B",
# "score": 0.0800000429,
# "values": [],
# "metadata": {
# "genre": "documentary",
# "year": 2019
# }
# }
# ],
# "namespace": ""
# }
```

### More example filter expressions

A comedy, documentary, or drama:

```JSON
{
"genre": { "$in": ["comedy", "documentary", "drama"] }
}
```

A drama from 2020:

```JSON
{
"genre": { "$eq": "drama" },
  "year": { "$gte": 2020 }
}
```

A drama from 2020 (equivalent to the previous example):

```JSON
{
"$and": [{ "genre": { "$eq": "drama" } }, { "year": { "$gte": 2020 } }]
}
```

A drama or a movie from 2020:

```JSON
{
"$or": [{ "genre": { "$eq": "drama" } }, { "year": { "$gte": 2020 } }]
}
```

## Deleting vectors by metadata filter

To specify vectors to be deleted by metadata values, pass a metadata filter expression to the delete operation. This deletes all vectors matching the metadata filter expression.

Projects in the gcp-starter region do not support deleting by metadata.

### Example

This example deletes all vectors with genre "documentary" and year 2019 from an index.

```js
await index._delete({
    deleteRequest: {
    filter: {
    genre: { $eq: "documentary" },
    year: 2019,
    }
});
```
