import { useState, useEffect } from 'react'
import Graph from './components/Graph'

const App = () => {
  const [fillsOrigin, setFillsOrigin] = useState([])
  const [fills, setFills] = useState([])
  const [symbols, setSymbols] = useState([])
  const [exchanges, setExchanges] = useState([])
  const [symbol, setSymbol] = useState('ALL')
  const [exchange, setExchange] = useState('ALL')

  // Get initial data from backend
  useEffect(() => {
    const getFills = async () => {
      const data = await fetchData('http://localhost:5000/fills', 'fills')
      setFillsOrigin(data)
      setFills(data)
    }
    const getSymbols = async () => {
      const data = await fetchData('http://localhost:5000/symbol', 'symbols')
      setSymbols(['ALL', ...data])
    }
    const getExchanges = async () => {
      const data = await fetchData('http://localhost:5000/exchange', 'exchanges')
      setExchanges(['ALL', ...data])
    }

    getFills()
    getSymbols()
    getExchanges()
  }, [])

  // Filter data by symbol/exchange when value changes
  useEffect(() => {
    if (symbol !== 'ALL' && exchange !== 'ALL')
      setFills(fillsOrigin.filter( fill => fill.symbol === symbol && fill.exchange === exchange ))
    else if (symbol !== 'ALL')
      setFills(fillsOrigin.filter( fill => fill.symbol === symbol ))
    else if (exchange !== 'ALL')
      setFills(fillsOrigin.filter( fill => fill.exchange === exchange ))
    else
      setFills(fillsOrigin)
  }, [symbol, exchange, fillsOrigin])

  const fetchData = async (url, field) => {
    const res = await fetch(url)
    const data = await res.json()

    console.log(data[field])
    return data[field]
  }

  const handleSymbolChange = (e) => {
    setSymbol(e.target.value)
  }

  const handleExchangeChange = (e) => {
    setExchange(e.target.value)
  }

  return (
    <div className="App">
      <label>
        Symbol
        <select value={symbol} onChange={handleSymbolChange}>
          {symbols.map((symbol, idx) => (
            <option key={idx} value={symbol}>{symbol}</option>
          ))}
        </select>
      </label>
      <label>
        Exchange
        <select value={exchange} onChange={handleExchangeChange}>
          {exchanges.map((exchange, idx) => (
            <option key={idx} value={exchange}>{exchange}</option>
          ))}
        </select>
      </label>
      <Graph fills={fills}/>
    </div>
  );
}

export default App;
