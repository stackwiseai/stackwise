test("flattenInputJson correctly", async () => {
  const array = [
    { _id: "1", todo: "DO work" },
    { _id: "2", todo: "Walk the dog" },
    { _id: "3", todo: "Buy Mangoes" },
    { _id: "4", todo: "Paint the Walls" },
  ];

  const from = 0;
  const to = 2;

  const response = stack(
    "Make a function that moves an item from an index to another index.",
    {
      in: {
        array,
        from,
        to,
      },
      out: [
        { _id: "2", todo: "Walk the dog" },
        { _id: "1", todo: "DO work" },
        { _id: "3", todo: "Buy Mangoes" },
        { _id: "4", todo: "Paint the Walls" },
      ],
    }
  );

  expect(response).toEqual([
    { _id: "2", todo: "Walk the dog" },
    { _id: "1", todo: "DO work" },
    { _id: "3", todo: "Buy Mangoes" },
    { _id: "4", todo: "Paint the Walls" },
  ]);
});
