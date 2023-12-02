import axios from "axios";
import { search, SafeSearchType } from "duck-duck-scrape";

/**
 * Brief: Make a search using duckduckgo
 */
export default async function searchUsingDuckDuckGo(
  input: string
): Promise<any> {
  return search(input, {
    safeSearch: SafeSearchType.STRICT,
  });
}
