import {
  ISolSplTokenItem,
  // ISolSplTokenListResponse, ISolSplTokenMeta,
  // ISolSplTokenMetaMultiResponse,
  // ISolSplTokenMetaResponse,
  ISolSplTokenPriceMultiResponse
  // } from 'src/interface/sol_spl';
} from '@gr/interface-api/platform-data';

export async function fetch_SolSplTokenPriceMulti_And_MergePrice(
  tokens: ISolSplTokenItem[],
  from_time: string,
  to_time: string,
  batchSize: number,
  getJsonFromUrl: (url: string, errorMessage: string) => Promise<any>
): Promise<void> {
  const allAddresses = tokens.map(token => token.address);
  const addressToPriceMap = new Map<string, number>();

  for (let i = 0; i < allAddresses.length; i += batchSize) {
    const batch = allAddresses.slice(i, i + batchSize);
    const caArrayLine = batch.map(addr => `address[]=${addr}`).join("&");

    const url = `https://pro-api.solscan.io/v2.0/token/price/multi?${caArrayLine}&from_time=${from_time}&to_time=${to_time}`;

    try {
      const priceRes: ISolSplTokenPriceMultiResponse = await getJsonFromUrl(url, `Error fetching prices batch ${i / batchSize + 1}`);

      priceRes.data.forEach(tokenPrice => {
        const priceEntry = tokenPrice.prices?.[0];
        if (priceEntry && typeof priceEntry.price === "number") {
          addressToPriceMap.set(tokenPrice.token_address, priceEntry.price);
        }
      });
    } catch (err) {
      console.error(`Price fetch error for batch ${i / batchSize + 1}:`, err);
    }
  }

  tokens.forEach(token => {
    if (addressToPriceMap.has(token.address)) {
      token.price = addressToPriceMap.get(token.address)!;
    }
  });
}
