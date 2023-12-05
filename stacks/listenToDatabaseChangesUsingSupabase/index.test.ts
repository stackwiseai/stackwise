test("Listen to database changes using supabase", async () => {
  const channel_name = "schema-db-changes";
  const callback_function = (payload) => {
    console.log("Database has changed!:", payload);
  };

  const channel = stack("Listen to database changes using supabase", {
    in: {
      channel_name: channel_name,
      callback: callback_function,
    },
    out: {
      channel: "",
    },
  });

  expect(channel).not.toBeNull();
});
