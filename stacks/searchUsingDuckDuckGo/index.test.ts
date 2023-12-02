import { search, SafeSearchType } from "duck-duck-scrape";
// import * as DDG from 'duck-duck-scrape';

import searchUsingDuckDuckGo from ".";
test("Find when the queen died", async () => {
  const query = "what date the queen died";

  const response = await searchUsingDuckDuckGo(query);
  expect(JSON.stringify(response)).toContain("September 8, 2022");
});
