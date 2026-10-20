/**
 * Optional WharfKit SessionKit bootstrap.
 *
 * Install when ready:
 *   npm i @wharfkit/session @wharfkit/session-plugin-web-renderer \
 *         @wharfkit/wallet-plugin-anchor @wharfkit/wallet-plugin-cloudwallet
 *
 * This file dynamic-imports so the rest of the blueprint stays install-light.
 */

import type { SessionLike } from "./types";

/** WAX mainnet chain id (Antelope). */
export const WAX_MAINNET_CHAIN_ID =
  "1064487b3cd1a897ce03ae5b6a865651747e2e15209765797e784ba3fbf3c7ac";

export interface CreateSessionKitOptions {
  appName?: string;
  /** RPC URL for chain definition */
  rpcUrl?: string;
  chainId?: string;
}

export interface SessionKitLike {
  login(): Promise<{ session: SessionLike }>;
  logout?(session?: SessionLike): Promise<void>;
}

export async function createSessionKit(
  options: CreateSessionKitOptions = {}
): Promise<SessionKitLike> {
  const appName = options.appName ?? "Pixel Journey Packs";
  const rpcUrl = options.rpcUrl ?? "https://wax.greymass.com";
  const chainId = options.chainId ?? WAX_MAINNET_CHAIN_ID;

  try {
    const [{ SessionKit }, { WebRenderer }, anchorMod, cloudMod] =
      await Promise.all([
        import("@wharfkit/session"),
        import("@wharfkit/web-renderer"),
        import("@wharfkit/wallet-plugin-anchor"),
        import("@wharfkit/wallet-plugin-cloudwallet"),
      ]);

    const WalletPluginAnchor =
      (anchorMod as { WalletPluginAnchor: new () => unknown }).WalletPluginAnchor;
    const WalletPluginCloudWallet = (
      cloudMod as { WalletPluginCloudWallet: new () => unknown }
    ).WalletPluginCloudWallet;

    const kit = new SessionKit({
      appName,
      chains: [
        {
          id: chainId,
          url: rpcUrl,
        },
      ],
      ui: new WebRenderer(),
      walletPlugins: [new WalletPluginAnchor(), new WalletPluginCloudWallet()],
    });

    return kit as unknown as SessionKitLike;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(
      `WharfKit packages not available (${msg}). Install @wharfkit/session, @wharfkit/web-renderer, @wharfkit/wallet-plugin-anchor, @wharfkit/wallet-plugin-cloudwallet.`
    );
  }
}

/** Dry-run session for UI demos — never broadcasts. */
export function createDryRunSession(actor = "demo.wam"): SessionLike {
  return {
    actor,
    permission: "active",
    async transact(args) {
      console.info("[dry-run] would transact", args);
      return {
        transaction_id: `dry-run-${Date.now()}`,
        dryRun: true,
        actions: args.actions,
      };
    },
  };
}
