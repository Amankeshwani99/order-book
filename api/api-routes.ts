import axios from "axios";

const baseUrl = "https://api-pub.bitfinex.com/v2";

export const getOhlcData = async (timeFrame:string, limit:number) => {
  try {
    const response = await axios.get(
      `${baseUrl}/candles/trade:${timeFrame}:tBTCUSD/hist?limit=${limit}`
    );
    return response;
  } catch (error) {
    return error;
  }
};
