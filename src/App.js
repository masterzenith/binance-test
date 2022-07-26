import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateBids, updateAsks } from './actions';
import './App.css';
import InfoCard from './infoCard/InfoCard';

const App = () => {
  const dispatch = useDispatch();
  const { bids, asks } = useSelector(({ bids, asks }) => ({ bids, asks }));
  // TODO: Should use binance test api token
  // TODO: API Key: wnYmGZY55F2VYC1tGa7SdFYsHlyfDGaQ2yVcLgBET8ziMxuQmE8HbClv6wyhyqGv
  // TODO: Secret Key: hhyMnCcRBrvLNBa3ANepTdO31bmK0tNF7nwqeuqzEArG5nlEWrIMMxtSKSEkroN0
  useEffect(() => {
    const conn = new WebSocket("wss://dex.binance.org/api/ws");
    conn.onopen = () => {
      conn.send(JSON.stringify({ method: "subscribe", topic: "marketDepth", symbols: ["BNB_BTCB-1DE"] }));
    }
    conn.onmessage = ({ data }) => {
      const { data: parsedData } = JSON.parse(data);
      const { bids, asks } = parsedData;
      dispatch(updateBids({ bids }));
      dispatch(updateAsks({ asks }));
    }

    return () => {
      conn.close();
    }
  }, [dispatch]);
  return (
    <div className="App">
      <div className="bids">
        {bids.map((bid, index) => (
          <InfoCard
            key={`bid_${index}`}
            type="bid"
            value={parseFloat(bid[0])}
            amount={parseFloat(bid[1])}
          />
        ))}
      </div>
      <div className="asks">
        {asks.map((ask, index) => (
          <InfoCard
            key={`ask_${index}`}
            type="ask"
            value={parseFloat(ask[0])}
            amount={parseFloat(ask[1])}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
