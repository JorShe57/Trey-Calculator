import { useState, useEffect } from 'react'
import './App.css'

// Default values
const DEFAULTS = {
  dealerCost: 10000,
  buyerPercentage: 50,
  transactionFee: 7,
  freightContribution: 50
}

// Preset scenarios for comparison
const PRESET_SCENARIOS = [
  { name: "Standard", transactionFee: 7, freight: 50 },
  { name: "Low Fee", transactionFee: 5, freight: 50 },
  { name: "High Fee", transactionFee: 10, freight: 50 },
  { name: "No Freight", transactionFee: 7, freight: 0 }
]

function App() {
  // Input state
  const [dealerCost, setDealerCost] = useState(DEFAULTS.dealerCost)
  const [buyerPercentage, setBuyerPercentage] = useState(DEFAULTS.buyerPercentage)
  const [transactionFee, setTransactionFee] = useState(DEFAULTS.transactionFee)
  const [freightContribution, setFreightContribution] = useState(DEFAULTS.freightContribution)

  // Custom scenarios state
  const [customScenarios, setCustomScenarios] = useState([])
  const [showAddScenario, setShowAddScenario] = useState(false)
  const [newScenario, setNewScenario] = useState({ name: '', transactionFee: 7, freight: 50 })

  // Show formula state
  const [showFormulas, setShowFormulas] = useState({
    buyerBase: false,
    transactionFee: false,
    freight: false
  })

  // Calculation functions (exact as specified)
  const calculateBuyerBase = () => {
    return (dealerCost * buyerPercentage) / 100
  }

  const calculateTransactionFee = (base) => {
    return (base * transactionFee) / 100
  }

  const calculateFreightContribution = () => {
    return (dealerCost / 1000) * freightContribution
  }

  const calculateTotal = () => {
    const buyerBase = calculateBuyerBase()
    const transactionFeeAmount = calculateTransactionFee(buyerBase)
    const freightAmount = calculateFreightContribution()
    return buyerBase + transactionFeeAmount + freightAmount
  }

  // Calculate scenario total
  const calculateScenarioTotal = (txFee, freight) => {
    const buyerBase = calculateBuyerBase()
    const transactionFeeAmount = (buyerBase * txFee) / 100
    const freightAmount = (dealerCost / 1000) * freight
    return buyerBase + transactionFeeAmount + freightAmount
  }

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
  }

  // Reset to defaults
  const handleReset = () => {
    setDealerCost(DEFAULTS.dealerCost)
    setBuyerPercentage(DEFAULTS.buyerPercentage)
    setTransactionFee(DEFAULTS.transactionFee)
    setFreightContribution(DEFAULTS.freightContribution)
  }

  // Copy results to clipboard
  const handleCopyResults = async () => {
    const buyerBase = calculateBuyerBase()
    const transactionFeeAmount = calculateTransactionFee(buyerBase)
    const freightAmount = calculateFreightContribution()
    const total = calculateTotal()

    const text = `Buyer Purchase Price Calculation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Dealer Cost: ${formatCurrency(dealerCost)}
Buyer Pays: ${buyerPercentage}%
Transaction Fee: ${transactionFee}%
Freight Contribution: $${freightContribution} per $1,000

Calculated Results:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Buyer Base (${buyerPercentage}%): ${formatCurrency(buyerBase)}
Transaction Fee (${transactionFee}%): ${formatCurrency(transactionFeeAmount)}
Freight Contribution: ${formatCurrency(freightAmount)}

TOTAL BUYER PRICE: ${formatCurrency(total)}`

    try {
      await navigator.clipboard.writeText(text)
      alert('Results copied to clipboard!')
    } catch (err) {
      alert('Failed to copy to clipboard')
    }
  }

  // Add custom scenario
  const handleAddScenario = () => {
    if (newScenario.name.trim()) {
      setCustomScenarios([...customScenarios, { ...newScenario }])
      setNewScenario({ name: '', transactionFee: 7, freight: 50 })
      setShowAddScenario(false)
    }
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault()
        handleReset()
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  const buyerBase = calculateBuyerBase()
  const transactionFeeAmount = calculateTransactionFee(buyerBase)
  const freightAmount = calculateFreightContribution()
  const totalBuyerPrice = calculateTotal()
  const units = dealerCost / 1000

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-blue-600 gradient-animate py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Main Title */}
        <h1 className="text-4xl font-bold text-white text-center mb-8 drop-shadow-lg">
          Buyer Purchase Price Calculator
        </h1>

        {/* Section 1 - Inputs */}
        <div className="bg-white rounded-lg shadow-2xl p-6 mb-6 print-break-inside-avoid">
          <div className="bg-gradient-to-r from-blue-400 to-purple-400 -m-6 mb-6 p-6 rounded-t-lg">
            <h2 className="text-xl font-semibold text-white">
              Adjust the transaction fee and freight contribution to see the final buyer purchase price
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Total Dealer Cost */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Dealer Cost ($)
              </label>
              <input
                type="number"
                value={dealerCost}
                onChange={(e) => setDealerCost(Math.max(0, Number(e.target.value)))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-lg"
                min="0"
                step="100"
              />
            </div>

            {/* Buyer Pays % */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buyer Pays % of Dealer Cost (%)
              </label>
              <input
                type="number"
                value={buyerPercentage}
                onChange={(e) => setBuyerPercentage(Math.min(100, Math.max(0, Number(e.target.value))))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-lg"
                min="0"
                max="100"
                step="1"
              />
            </div>

            {/* Transaction Fee % */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                Transaction Fee (%)
                <button
                  className="group relative no-print"
                  onMouseEnter={() => setShowFormulas({ ...showFormulas, transactionFee: true })}
                  onMouseLeave={() => setShowFormulas({ ...showFormulas, transactionFee: false })}
                >
                  <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  {showFormulas.transactionFee && (
                    <div className="absolute left-0 top-6 bg-gray-900 text-white text-xs rounded py-1 px-2 z-10 whitespace-nowrap">
                      Applied to buyer base amount
                    </div>
                  )}
                </button>
              </label>
              <input
                type="number"
                value={transactionFee}
                onChange={(e) => setTransactionFee(Math.min(100, Math.max(0, Number(e.target.value))))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-lg"
                min="0"
                max="100"
                step="0.5"
              />
            </div>

            {/* Buyer Freight Contribution */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buyer Freight Contribution ($ per $1,000 dealer cost)
              </label>
              <input
                type="number"
                value={freightContribution}
                onChange={(e) => setFreightContribution(Math.max(0, Number(e.target.value)))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-lg"
                min="0"
                step="5"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-6 no-print">
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors shadow-md"
            >
              Reset to Defaults (Ctrl+R)
            </button>
            <button
              onClick={handleCopyResults}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors shadow-md"
            >
              Copy Results
            </button>
          </div>
        </div>

        {/* Section 2 - Calculated Results */}
        <div className="bg-white rounded-lg shadow-2xl p-6 mb-6 border-4 border-blue-300 print-break-inside-avoid">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-gray-200">
            Calculated Results
          </h2>

          <div className="space-y-4">
            {/* Buyer Base */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-700">
                    Buyer Base (at {buyerPercentage}%):
                  </span>
                  <button
                    className="group relative no-print"
                    onClick={() => setShowFormulas({ ...showFormulas, buyerBase: !showFormulas.buyerBase })}
                  >
                    <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <span className="text-xl font-bold text-blue-600 smooth-number">
                  {formatCurrency(buyerBase)}
                </span>
              </div>
              {showFormulas.buyerBase && (
                <div className="mt-2 text-sm text-gray-600 bg-white p-2 rounded border border-blue-200">
                  Formula: ${dealerCost.toLocaleString()} × {buyerPercentage}% ÷ 100 = {formatCurrency(buyerBase)}
                </div>
              )}
            </div>

            {/* Transaction Fee */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-700">
                    Transaction Fee ({transactionFee}%):
                  </span>
                  <button
                    className="group relative no-print"
                    onClick={() => setShowFormulas({ ...showFormulas, transactionFee: !showFormulas.transactionFee })}
                  >
                    <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <span className="text-xl font-bold text-blue-600 smooth-number">
                  {formatCurrency(transactionFeeAmount)}
                </span>
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {transactionFee}% of {formatCurrency(buyerBase)} buyer base
              </div>
              {showFormulas.transactionFee && (
                <div className="mt-2 text-sm text-gray-600 bg-white p-2 rounded border border-blue-200">
                  Formula: {formatCurrency(buyerBase)} × {transactionFee}% ÷ 100 = {formatCurrency(transactionFeeAmount)}
                </div>
              )}
            </div>

            {/* Freight Contribution */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-700">
                    Freight Contribution:
                  </span>
                  <button
                    className="group relative no-print"
                    onClick={() => setShowFormulas({ ...showFormulas, freight: !showFormulas.freight })}
                  >
                    <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <span className="text-xl font-bold text-blue-600 smooth-number">
                  {formatCurrency(freightAmount)}
                </span>
              </div>
              <div className="text-sm text-gray-600 mt-1">
                ${freightContribution} per $1,000 × {units.toFixed(1)} units
              </div>
              {showFormulas.freight && (
                <div className="mt-2 text-sm text-gray-600 bg-white p-2 rounded border border-blue-200">
                  Formula: ${dealerCost.toLocaleString()} ÷ 1,000 × ${freightContribution} = {formatCurrency(freightAmount)}
                </div>
              )}
            </div>

            {/* Total */}
            <div className="bg-gradient-to-r from-green-100 to-green-200 p-6 rounded-lg border-2 border-green-400">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-gray-800">
                  TOTAL BUYER PRICE:
                </span>
                <span className="text-3xl font-bold text-green-700 smooth-number">
                  {formatCurrency(totalBuyerPrice)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3 - Scenario Comparison */}
        <div className="bg-white rounded-lg shadow-2xl p-6 print-break-inside-avoid">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-gray-200">
            Compare Scenarios
          </h2>

          {/* Comparison Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 font-semibold border-b-2 border-gray-300">Scenario</th>
                  <th className="p-3 font-semibold border-b-2 border-gray-300">Transaction Fee %</th>
                  <th className="p-3 font-semibold border-b-2 border-gray-300">Freight ($ per $1,000)</th>
                  <th className="p-3 font-semibold border-b-2 border-gray-300">Total Buyer Price</th>
                  <th className="p-3 font-semibold border-b-2 border-gray-300">Difference vs Current</th>
                </tr>
              </thead>
              <tbody>
                {/* Current Scenario */}
                <tr className="bg-blue-50 font-semibold">
                  <td className="p-3 border-b">Current</td>
                  <td className="p-3 border-b">{transactionFee}%</td>
                  <td className="p-3 border-b">${freightContribution}</td>
                  <td className="p-3 border-b">{formatCurrency(totalBuyerPrice)}</td>
                  <td className="p-3 border-b text-gray-600">—</td>
                </tr>

                {/* Preset Scenarios */}
                {PRESET_SCENARIOS.map((scenario, idx) => {
                  const scenarioTotal = calculateScenarioTotal(scenario.transactionFee, scenario.freight)
                  const difference = scenarioTotal - totalBuyerPrice
                  const isLower = difference < 0

                  return (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="p-3 border-b">{scenario.name}</td>
                      <td className="p-3 border-b">{scenario.transactionFee}%</td>
                      <td className="p-3 border-b">${scenario.freight}</td>
                      <td className="p-3 border-b">{formatCurrency(scenarioTotal)}</td>
                      <td className={`p-3 border-b font-semibold ${isLower ? 'text-green-600' : difference > 0 ? 'text-red-600' : 'text-gray-600'}`}>
                        {difference === 0 ? '—' : `${isLower ? '-' : '+'}${formatCurrency(Math.abs(difference))}`}
                      </td>
                    </tr>
                  )
                })}

                {/* Custom Scenarios */}
                {customScenarios.map((scenario, idx) => {
                  const scenarioTotal = calculateScenarioTotal(scenario.transactionFee, scenario.freight)
                  const difference = scenarioTotal - totalBuyerPrice
                  const isLower = difference < 0

                  return (
                    <tr key={`custom-${idx}`} className="hover:bg-gray-50">
                      <td className="p-3 border-b">{scenario.name}</td>
                      <td className="p-3 border-b">{scenario.transactionFee}%</td>
                      <td className="p-3 border-b">${scenario.freight}</td>
                      <td className="p-3 border-b">{formatCurrency(scenarioTotal)}</td>
                      <td className={`p-3 border-b font-semibold ${isLower ? 'text-green-600' : difference > 0 ? 'text-red-600' : 'text-gray-600'}`}>
                        {difference === 0 ? '—' : `${isLower ? '-' : '+'}${formatCurrency(Math.abs(difference))}`}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Add Custom Scenario */}
          <div className="mt-6 no-print">
            {!showAddScenario ? (
              <button
                onClick={() => setShowAddScenario(true)}
                className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg transition-colors shadow-md"
              >
                + Custom Scenario
              </button>
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg border-2 border-purple-300">
                <h3 className="font-semibold mb-3">Add Custom Scenario</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Scenario name"
                    value={newScenario.name}
                    onChange={(e) => setNewScenario({ ...newScenario, name: e.target.value })}
                    className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Transaction fee %"
                    value={newScenario.transactionFee}
                    onChange={(e) => setNewScenario({ ...newScenario, transactionFee: Number(e.target.value) })}
                    className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 outline-none"
                    min="0"
                    max="100"
                  />
                  <input
                    type="number"
                    placeholder="Freight per $1,000"
                    value={newScenario.freight}
                    onChange={(e) => setNewScenario({ ...newScenario, freight: Number(e.target.value) })}
                    className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 outline-none"
                    min="0"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleAddScenario}
                    className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg transition-colors"
                  >
                    Add Scenario
                  </button>
                  <button
                    onClick={() => {
                      setShowAddScenario(false)
                      setNewScenario({ name: '', transactionFee: 7, freight: 50 })
                    }}
                    className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white font-semibold rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* What-If Analysis */}
          <div className="mt-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">What-If Analysis: Transaction Fee Impact</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 font-semibold border-b-2 border-gray-300">Fee Change</th>
                    <th className="p-2 font-semibold border-b-2 border-gray-300">New Fee %</th>
                    <th className="p-2 font-semibold border-b-2 border-gray-300">Total Price</th>
                    <th className="p-2 font-semibold border-b-2 border-gray-300">Price Change</th>
                  </tr>
                </thead>
                <tbody>
                  {[-2, -1, 0, 1, 2].map((change) => {
                    const newFee = Math.max(0, transactionFee + change)
                    const scenarioTotal = calculateScenarioTotal(newFee, freightContribution)
                    const difference = scenarioTotal - totalBuyerPrice
                    const isLower = difference < 0
                    const isCurrent = change === 0

                    return (
                      <tr key={change} className={isCurrent ? 'bg-blue-50 font-semibold' : 'hover:bg-gray-50'}>
                        <td className="p-2 border-b">{change > 0 ? `+${change}%` : change < 0 ? `${change}%` : 'Current'}</td>
                        <td className="p-2 border-b">{newFee}%</td>
                        <td className="p-2 border-b">{formatCurrency(scenarioTotal)}</td>
                        <td className={`p-2 border-b font-semibold ${isLower ? 'text-green-600' : difference > 0 ? 'text-red-600' : 'text-gray-600'}`}>
                          {difference === 0 ? '—' : `${isLower ? '-' : '+'}${formatCurrency(Math.abs(difference))}`}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-white mt-8 text-sm no-print">
          <p>Press <kbd className="bg-white bg-opacity-20 px-2 py-1 rounded">Ctrl+R</kbd> to reset values to defaults</p>
        </div>
      </div>
    </div>
  )
}

export default App
