import { describe, expect, it } from "vitest";
import { currencyBalance, getAccount, historyActions, tableRows } from "./api";

describe("query builders", () => {
  it("locks history, balance, account, and table-row requests", () => {
    const history = historyActions("https://wax.eosusa.io", "alice", "eosio.token:transfer", 20);
    expect(history.executed).toBe(false);
    expect(history.url).toBe(
      "https://wax.eosusa.io/v2/history/get_actions?account=alice&filter=eosio.token%3Atransfer&limit=20&sort=desc",
    );
    expect(currencyBalance("https://wax.greymass.com", "alice").body).toEqual({
      code: "eosio.token",
      account: "alice",
      symbol: "WAX",
    });
    expect(getAccount("https://wax.greymass.com", "alice").body).toEqual({ account_name: "alice" });
    expect(tableRows("https://wax.greymass.com", "atomicpacksx", "1100003609672", "unboxassets", 20).body).toEqual({
      json: true,
      code: "atomicpacksx",
      scope: "1100003609672",
      table: "unboxassets",
      limit: 20,
    });
  });
});
