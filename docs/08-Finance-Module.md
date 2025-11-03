# Finance & Trading Module

## 💰 Financial Management System

Echo's finance module helps users build financial literacy, track investments, and prevent emotional trading—all while maintaining privacy and providing educational value.

---

## 🎯 Module Objectives

### Primary Goals
1. **Portfolio Tracking** - Monitor stocks and crypto holdings in real-time
2. **Emotional Trading Prevention** - Alert users to mood-influenced decisions
3. **Financial Education** - Build investment knowledge progressively
4. **Budget Awareness** - Track spending and savings goals
5. **Privacy Protection** - Keep financial data secure and local

### Success Metrics
- Reduced impulsive trading during negative moods
- Improved investment knowledge over time
- Consistent portfolio review without obsessive checking
- Better financial decision-making

---

## 📊 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                  FINANCE MODULE                         │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  Portfolio   │  │   Market     │  │  Education   │ │
│  │   Tracker    │  │   Monitor    │  │    Hub       │ │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘ │
│         │                  │                  │         │
│         └──────────────────┴──────────────────┘         │
│                            │                            │
│  ┌─────────────────────────▼──────────────────────┐    │
│  │        EMOTIONAL TRADING DETECTOR              │    │
│  │  (Integrates with Mood Module)                 │    │
│  └─────────────────────────┬──────────────────────┘    │
│                            │                            │
│  ┌─────────────────────────▼──────────────────────┐    │
│  │           LOCAL DATABASE                       │    │
│  │  • Holdings  • Transactions  • Watchlist       │    │
│  └─────────────────────────┬──────────────────────┘    │
│                            │                            │
└────────────────────────────┼────────────────────────────┘
                             │
         ┌───────────────────┴───────────────────┐
         │                                        │
         ▼                                        ▼
┌─────────────────┐                    ┌─────────────────┐
│  CoinGecko API  │                    │ Alpha Vantage   │
│  (Crypto Prices)│                    │ (Stock Prices)  │
└─────────────────┘                    └─────────────────┘
```

---

## 💼 Portfolio Management

### Data Models

```typescript
interface Asset {
  id: string;
  type: 'stock' | 'crypto' | 'etf';
  symbol: string;
  name: string;
  quantity: number;
  averageCost: number;
  currentPrice?: number;
  lastUpdated?: Date;
}

interface Portfolio {
  id: string;
  userId: string;
  assets: Asset[];
  totalValue: number;
  totalCost: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  lastUpdated: Date;
}

interface Transaction {
  id: string;
  userId: string;
  assetId: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  totalAmount: number;
  fees?: number;
  moodAtTransaction?: MoodType;
  notes?: string;
  timestamp: Date;
}

interface Watchlist {
  id: string;
  userId: string;
  assets: {
    symbol: string;
    type: 'stock' | 'crypto';
    targetPrice?: number;
    notes?: string;
  }[];
}
```

### Portfolio Service

```typescript
class PortfolioService {
  async getPortfolio(userId: string): Promise<Portfolio> {
    // Fetch holdings from database
    const assets = await db.portfolioHoldings.getByUser(userId);
    
    // Update prices
    const updatedAssets = await this.updatePrices(assets);
    
    // Calculate totals
    const totalValue = updatedAssets.reduce(
      (sum, asset) => sum + (asset.currentPrice || 0) * asset.quantity,
      0
    );
    
    const totalCost = updatedAssets.reduce(
      (sum, asset) => sum + asset.averageCost * asset.quantity,
      0
    );
    
    return {
      id: generateId(),
      userId,
      assets: updatedAssets,
      totalValue,
      totalCost,
      totalGainLoss: totalValue - totalCost,
      totalGainLossPercent: ((totalValue - totalCost) / totalCost) * 100,
      lastUpdated: new Date()
    };
  }
  
  async updatePrices(assets: Asset[]): Promise<Asset[]> {
    const cryptoSymbols = assets.filter(a => a.type === 'crypto').map(a => a.symbol);
    const stockSymbols = assets.filter(a => a.type === 'stock').map(a => a.symbol);
    
    // Fetch prices in parallel
    const [cryptoPrices, stockPrices] = await Promise.all([
      this.getCryptoPrices(cryptoSymbols),
      this.getStockPrices(stockSymbols)
    ]);
    
    return assets.map(asset => ({
      ...asset,
      currentPrice: asset.type === 'crypto' 
        ? cryptoPrices[asset.symbol]
        : stockPrices[asset.symbol],
      lastUpdated: new Date()
    }));
  }
  
  async addTransaction(transaction: Omit<Transaction, 'id' | 'timestamp'>) {
    // Get current mood
    const currentMood = await moodService.getCurrentMood();
    
    // Store transaction with mood
    const fullTransaction: Transaction = {
      ...transaction,
      id: generateId(),
      moodAtTransaction: currentMood?.mood_type,
      timestamp: new Date()
    };
    
    await db.financeTransactions.insert(fullTransaction);
    
    // Update holdings
    await this.updateHoldings(fullTransaction);
    
    return fullTransaction;
  }
  
  async updateHoldings(transaction: Transaction) {
    const holding = await db.portfolioHoldings.findByAsset(
      transaction.userId,
      transaction.assetId
    );
    
    if (transaction.type === 'buy') {
      if (holding) {
        // Update average cost
        const newQuantity = holding.quantity + transaction.quantity;
        const newAverageCost = (
          (holding.averageCost * holding.quantity) + 
          (transaction.price * transaction.quantity)
        ) / newQuantity;
        
        await db.portfolioHoldings.update(holding.id, {
          quantity: newQuantity,
          averageCost: newAverageCost
        });
      } else {
        // Create new holding
        await db.portfolioHoldings.insert({
          userId: transaction.userId,
          assetId: transaction.assetId,
          quantity: transaction.quantity,
          averageCost: transaction.price
        });
      }
    } else if (transaction.type === 'sell') {
      if (holding) {
        const newQuantity = holding.quantity - transaction.quantity;
        
        if (newQuantity <= 0) {
          await db.portfolioHoldings.delete(holding.id);
        } else {
          await db.portfolioHoldings.update(holding.id, {
            quantity: newQuantity
          });
        }
      }
    }
  }
}
```

---

## 📈 Market Data Integration

### CoinGecko API (Crypto)

```typescript
class CoinGeckoService {
  private baseUrl = 'https://api.coingecko.com/api/v3';
  private cache = new Map<string, CachedPrice>();
  private cacheTTL = 5 * 60 * 1000; // 5 minutes
  
  async getPrice(symbol: string): Promise<number> {
    // Check cache first
    const cached = this.cache.get(symbol);
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.price;
    }
    
    // Fetch from API
    const coinId = this.symbolToCoinId(symbol); // BTC -> bitcoin
    const response = await fetch(
      `${this.baseUrl}/simple/price?ids=${coinId}&vs_currencies=usd`
    );
    
    const data = await response.json();
    const price = data[coinId]?.usd;
    
    // Cache result
    this.cache.set(symbol, { price, timestamp: Date.now() });
    
    return price;
  }
  
  async getPrices(symbols: string[]): Promise<Record<string, number>> {
    const coinIds = symbols.map(s => this.symbolToCoinId(s)).join(',');
    
    const response = await fetch(
      `${this.baseUrl}/simple/price?ids=${coinIds}&vs_currencies=usd`
    );
    
    const data = await response.json();
    
    // Convert back to symbol keys
    const prices: Record<string, number> = {};
    for (const symbol of symbols) {
      const coinId = this.symbolToCoinId(symbol);
      prices[symbol] = data[coinId]?.usd || 0;
    }
    
    return prices;
  }
  
  async getMarketData(symbol: string): Promise<MarketData> {
    const coinId = this.symbolToCoinId(symbol);
    
    const response = await fetch(
      `${this.baseUrl}/coins/${coinId}?localization=false&tickers=false&community_data=false&developer_data=false`
    );
    
    const data = await response.json();
    
    return {
      symbol,
      name: data.name,
      currentPrice: data.market_data.current_price.usd,
      priceChange24h: data.market_data.price_change_percentage_24h,
      marketCap: data.market_data.market_cap.usd,
      volume24h: data.market_data.total_volume.usd,
      high24h: data.market_data.high_24h.usd,
      low24h: data.market_data.low_24h.usd
    };
  }
  
  private symbolToCoinId(symbol: string): string {
    const mapping: Record<string, string> = {
      'BTC': 'bitcoin',
      'ETH': 'ethereum',
      'USDT': 'tether',
      'BNB': 'binancecoin',
      'SOL': 'solana',
      'ADA': 'cardano',
      'DOT': 'polkadot'
      // Add more as needed
    };
    
    return mapping[symbol.toUpperCase()] || symbol.toLowerCase();
  }
}
```

### Alpha Vantage API (Stocks)

```typescript
class AlphaVantageService {
  private baseUrl = 'https://www.alphavantage.co/query';
  private apiKey = process.env.ALPHA_VANTAGE_API_KEY;
  private cache = new Map<string, CachedPrice>();
  private cacheTTL = 5 * 60 * 1000; // 5 minutes
  private rateLimiter = new RateLimiter(5, 60000); // 5 calls per minute
  
  async getPrice(symbol: string): Promise<number> {
    // Check cache
    const cached = this.cache.get(symbol);
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.price;
    }
    
    // Rate limiting
    await this.rateLimiter.wait();
    
    // Fetch from API
    const response = await fetch(
      `${this.baseUrl}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.apiKey}`
    );
    
    const data = await response.json();
    const price = parseFloat(data['Global Quote']?.['05. price'] || '0');
    
    // Cache result
    this.cache.set(symbol, { price, timestamp: Date.now() });
    
    return price;
  }
  
  async getQuote(symbol: string): Promise<StockQuote> {
    await this.rateLimiter.wait();
    
    const response = await fetch(
      `${this.baseUrl}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.apiKey}`
    );
    
    const data = await response.json();
    const quote = data['Global Quote'];
    
    return {
      symbol,
      price: parseFloat(quote['05. price']),
      change: parseFloat(quote['09. change']),
      changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
      volume: parseInt(quote['06. volume']),
      previousClose: parseFloat(quote['08. previous close']),
      open: parseFloat(quote['02. open']),
      high: parseFloat(quote['03. high']),
      low: parseFloat(quote['04. low'])
    };
  }
}
```

---

## 🚨 Emotional Trading Prevention

### Detection System

```typescript
class EmotionalTradingDetector {
  async checkBeforeTransaction(
    userId: string,
    transaction: Partial<Transaction>
  ): Promise<TradingAlert | null> {
    // Get current mood
    const currentMood = await moodService.getCurrentMood(userId);
    
    // Get portfolio check frequency
    const checksToday = await this.getPortfolioChecksToday(userId);
    
    // Get recent transactions
    const recentTransactions = await db.financeTransactions.getRecent(userId, 7);
    
    // Analyze patterns
    const riskLevel = this.calculateRiskLevel({
      mood: currentMood,
      checksToday,
      recentTransactions,
      proposedTransaction: transaction
    });
    
    if (riskLevel === 'high' || riskLevel === 'medium') {
      return this.generateAlert(riskLevel, currentMood, checksToday);
    }
    
    return null;
  }
  
  calculateRiskLevel(data: {
    mood: MoodEntry | null;
    checksToday: number;
    recentTransactions: Transaction[];
    proposedTransaction: Partial<Transaction>;
  }): 'low' | 'medium' | 'high' {
    let riskScore = 0;
    
    // Mood-based risk
    if (data.mood) {
      if (data.mood.mood_type === 'stressed' || data.mood.mood_type === 'low') {
        riskScore += 30;
      }
      if (data.mood.intensity <= 3) {
        riskScore += 20;
      }
    }
    
    // Excessive checking
    if (data.checksToday > 10) {
      riskScore += 25;
    } else if (data.checksToday > 5) {
      riskScore += 15;
    }
    
    // Frequent trading
    const tradesThisWeek = data.recentTransactions.length;
    if (tradesThisWeek > 5) {
      riskScore += 20;
    }
    
    // Transaction size relative to portfolio
    // (would need portfolio value calculation)
    
    // Mood correlation with past trades
    const moodTrades = data.recentTransactions.filter(
      t => t.moodAtTransaction === data.mood?.mood_type
    );
    if (moodTrades.length > 0) {
      // Check if those trades were profitable
      const profitability = this.calculateProfitability(moodTrades);
      if (profitability < 0) {
        riskScore += 25; // Past trades in this mood lost money
      }
    }
    
    // Determine risk level
    if (riskScore >= 60) return 'high';
    if (riskScore >= 30) return 'medium';
    return 'low';
  }
  
  generateAlert(
    riskLevel: 'medium' | 'high',
    mood: MoodEntry | null,
    checksToday: number
  ): TradingAlert {
    const messages = {
      high: {
        title: '⚠️ High Risk of Emotional Trading',
        body: `You've checked your portfolio ${checksToday} times today while feeling ${mood?.mood_type}. Consider waiting 24 hours before trading.`,
        recommendation: 'Take a break and revisit this decision tomorrow with a clear mind.'
      },
      medium: {
        title: '⚡ Emotional Trading Alert',
        body: `Your current mood (${mood?.mood_type}) may be influencing this decision. Are you sure?`,
        recommendation: 'Write down your reasoning and review it in 30 minutes.'
      }
    };
    
    return {
      level: riskLevel,
      ...messages[riskLevel],
      coolingPeriod: riskLevel === 'high' ? 24 * 60 * 60 * 1000 : 30 * 60 * 1000,
      requiresConfirmation: true
    };
  }
  
  async trackPortfolioCheck(userId: string) {
    await db.portfolioChecks.insert({
      userId,
      timestamp: new Date()
    });
  }
  
  async getPortfolioChecksToday(userId: string): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const checks = await db.portfolioChecks.countSince(userId, today);
    return checks;
  }
}
```

### Alert UI Flow

```typescript
async function handleTradeAttempt(transaction: Partial<Transaction>) {
  // Check for emotional trading
  const alert = await emotionalTradingDetector.checkBeforeTransaction(
    userId,
    transaction
  );
  
  if (alert) {
    // Show warning dialog
    const userChoice = await showAlert({
      title: alert.title,
      message: alert.body,
      buttons: [
        { text: 'Cancel Trade', style: 'cancel' },
        { text: 'Journal Reasoning', onPress: () => openJournal(transaction) },
        { text: 'Proceed Anyway', style: 'destructive' }
      ]
    });
    
    if (userChoice === 'cancel') {
      return;
    }
    
    if (userChoice === 'journal') {
      // Require user to write reasoning
      const reasoning = await promptForReasoning();
      transaction.notes = reasoning;
      
      // Ask again after journaling
      const confirmAfterJournal = await confirm('Still want to proceed?');
      if (!confirmAfterJournal) return;
    }
  }
  
  // Proceed with transaction
  await portfolioService.addTransaction(transaction);
}
```

---

## 📚 Financial Education Hub

### Learning Content Structure

```typescript
interface FinancialLesson {
  id: string;
  category: 'basics' | 'stocks' | 'crypto' | 'risk' | 'analysis';
  title: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  content: string;
  estimatedTime: number; // minutes
  quiz?: Quiz;
  resources?: Resource[];
}

interface Quiz {
  questions: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }[];
}
```

### Education Service

```typescript
class FinanceEducationService {
  async getDailyLesson(userLevel: string): Promise<FinancialLesson> {
    // Get user's learning progress
    const progress = await db.financeProgress.getByUser(userId);
    
    // Select appropriate lesson
    const lesson = await this.selectNextLesson(progress, userLevel);
    
    return lesson;
  }
  
  async generatePersonalizedInsight(portfolio: Portfolio): Promise<string> {
    const prompt = `
      Analyze this portfolio and provide ONE educational insight:
      
      Total Value: $${portfolio.totalValue.toFixed(2)}
      Number of Assets: ${portfolio.assets.length}
      Gain/Loss: ${portfolio.totalGainLossPercent.toFixed(2)}%
      
      Asset Breakdown:
      ${portfolio.assets.map(a => `- ${a.symbol}: ${a.quantity} units`).join('\n')}
      
      Provide a beginner-friendly insight about diversification, risk, or strategy.
      Keep it under 100 words and actionable.
    `;
    
    const response = await gemini.generateContent(prompt);
    return response.text;
  }
  
  getLessons(): FinancialLesson[] {
    return [
      {
        id: 'basics_1',
        category: 'basics',
        title: 'What is Investing?',
        difficulty: 'beginner',
        content: `
          Investing is putting money into assets (stocks, crypto, etc.) 
          with the expectation that they will grow in value over time.
          
          Key Concepts:
          • Risk vs. Reward: Higher potential returns usually mean higher risk
          • Diversification: Don't put all eggs in one basket
          • Long-term thinking: Markets fluctuate, but tend to grow over time
          • Dollar-cost averaging: Invest regularly regardless of price
        `,
        estimatedTime: 5,
        quiz: {
          questions: [
            {
              question: 'What is diversification?',
              options: [
                'Buying only one stock',
                'Spreading investments across different assets',
                'Selling everything when prices drop',
                'Only investing in crypto'
              ],
              correctAnswer: 1,
              explanation: 'Diversification means spreading your investments to reduce risk.'
            }
          ]
        }
      },
      {
        id: 'crypto_1',
        category: 'crypto',
        title: 'Understanding Cryptocurrency',
        difficulty: 'beginner',
        content: `
          Cryptocurrency is digital money secured by cryptography.
          
          Key Points:
          • Decentralized: No central authority controls it
          • Blockchain: Transactions recorded on a public ledger
          • Volatility: Prices can change dramatically
          • Bitcoin: The first and most well-known cryptocurrency
          
          Risks:
          • High volatility
          • Regulatory uncertainty
          • Security concerns (wallet hacks)
        `,
        estimatedTime: 7
      }
      // More lessons...
    ];
  }
}
```

---

## 📊 Dashboard & Visualization

### Portfolio Dashboard Components

```typescript
interface PortfolioDashboard {
  summary: {
    totalValue: number;
    totalGainLoss: number;
    totalGainLossPercent: number;
    dayChange: number;
    dayChangePercent: number;
  };
  
  assetAllocation: {
    stocks: number;
    crypto: number;
    cash: number;
  };
  
  topPerformers: Asset[];
  topLosers: Asset[];
  
  recentActivity: Transaction[];
  
  insights: string[];
  
  moodCorrelation?: {
    bestTradingMood: MoodType;
    worstTradingMood: MoodType;
    profitByMood: Record<MoodType, number>;
  };
}
```

### Mood-Trading Correlation Analysis

```typescript
async function analyzeMoodTradingCorrelation(userId: string) {
  const transactions = await db.financeTransactions.getAll(userId);
  
  // Group by mood
  const byMood: Record<MoodType, Transaction[]> = {};
  for (const tx of transactions) {
    if (tx.moodAtTransaction) {
      if (!byMood[tx.moodAtTransaction]) {
        byMood[tx.moodAtTransaction] = [];
      }
      byMood[tx.moodAtTransaction].push(tx);
    }
  }
  
  // Calculate profitability by mood
  const profitByMood: Record<MoodType, number> = {};
  for (const [mood, txs] of Object.entries(byMood)) {
    const profit = await calculateProfitForTransactions(txs);
    profitByMood[mood as MoodType] = profit;
  }
  
  // Find best and worst
  const sorted = Object.entries(profitByMood).sort((a, b) => b[1] - a[1]);
  
  return {
    bestTradingMood: sorted[0][0] as MoodType,
    worstTradingMood: sorted[sorted.length - 1][0] as MoodType,
    profitByMood,
    insight: generateMoodTradingInsight(profitByMood)
  };
}

function generateMoodTradingInsight(profitByMood: Record<MoodType, number>): string {
  const best = Object.entries(profitByMood).sort((a, b) => b[1] - a[1])[0];
  const worst = Object.entries(profitByMood).sort((a, b) => a[1] - b[1])[0];
  
  return `
    Your most profitable trades happen when you're feeling ${best[0]} 
    (${best[1] > 0 ? '+' : ''}${best[1].toFixed(2)}% average return).
    
    Trades made while ${worst[0]} tend to lose money 
    (${worst[1].toFixed(2)}% average return).
    
    Recommendation: Avoid trading when feeling ${worst[0]}.
  `;
}
```

---

## 🔒 Security & Privacy

### Data Protection

```typescript
// Encrypt sensitive financial data
class FinanceDataEncryption {
  async encryptTransaction(transaction: Transaction): Promise<EncryptedTransaction> {
    const sensitiveFields = {
      quantity: transaction.quantity,
      price: transaction.price,
      totalAmount: transaction.totalAmount,
      notes: transaction.notes
    };
    
    const encrypted = await encrypt(JSON.stringify(sensitiveFields));
    
    return {
      ...transaction,
      encryptedData: encrypted,
      quantity: 0, // Clear sensitive data
      price: 0,
      totalAmount: 0,
      notes: ''
    };
  }
  
  async decryptTransaction(encrypted: EncryptedTransaction): Promise<Transaction> {
    const decrypted = await decrypt(encrypted.encryptedData);
    const sensitiveFields = JSON.parse(decrypted);
    
    return {
      ...encrypted,
      ...sensitiveFields
    };
  }
}
```

---

## 💡 Feature Summary

### What Makes Echo's Finance Module Unique

1. **Mood Integration** - First finance tracker that prevents emotional trading
2. **Educational Focus** - Learn while you track
3. **Privacy-First** - All data stored locally and encrypted
4. **Holistic View** - Finance as part of overall well-being
5. **Behavioral Insights** - Understand your trading psychology

---

**Echo's finance module helps you build wealth wisely—by understanding not just the markets, but yourself.**
