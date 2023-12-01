import getRecordById from "../../stacks/getRecordById";
test("Get one record on pocketbase by id", async () => {
  const collectionName = "example";
  const recordId = "sdhvoh20v7tps83";

  const response = await getRecordById(collectionName, recordId);

  expect(response).toEqual({
    id: "sdhvoh20v7tps83",
    name: "Antonio",
    order: 2,
  });
});
