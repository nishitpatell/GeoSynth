import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpDown, Calculator } from 'lucide-react';
import { exchangeRateService } from '@/services/exchangeRateService';
import { toast } from 'sonner';

const CurrencyConverter = ({ defaultFromCurrency = 'USD', defaultToCurrency = 'EUR', compact = false }) => {
  const [amount, setAmount] = useState('100');
  const [fromCurrency, setFromCurrency] = useState(defaultFromCurrency);
  const [toCurrency, setToCurrency] = useState(defaultToCurrency);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currencies, setCurrencies] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [lastUpdated, setLastUpdated] = useState(null);

  const popularCurrencies = [
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'JPY', name: 'Japanese Yen' },
    { code: 'CAD', name: 'Canadian Dollar' },
    { code: 'AUD', name: 'Australian Dollar' },
    { code: 'CHF', name: 'Swiss Franc' },
    { code: 'CNY', name: 'Chinese Yuan' },
    { code: 'INR', name: 'Indian Rupee' },
    { code: 'BRL', name: 'Brazilian Real' },
  ];

  useEffect(() => {
    loadSupportedCurrencies();
  }, []);

  // Sync with URL params
  useEffect(() => {
    const urlFrom = searchParams.get('from');
    const urlTo = searchParams.get('to');
    const urlAmount = searchParams.get('amount');

    let changed = false;
    if (urlFrom && urlFrom !== fromCurrency) {
      setFromCurrency(urlFrom.toUpperCase());
      changed = true;
    }
    if (urlTo && urlTo !== toCurrency) {
      setToCurrency(urlTo.toUpperCase());
      changed = true;
    }
    if (urlAmount && urlAmount !== amount) {
      setAmount(urlAmount);
      changed = true;
    }

    // Auto-convert when params change and amount present
    if (changed && (urlAmount ?? amount)) {
      setResult(null);
      // slight defer to ensure state updates applied
      setTimeout(() => {
        convertCurrency();
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    if (amount && !isNaN(parseFloat(amount))) {
      setResult(null);
      const id = setTimeout(() => convertCurrency(), 0);
      return () => clearTimeout(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    if (!result) return;
    const interval = setInterval(() => {
      convertCurrency();
    }, 60000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result, fromCurrency, toCurrency, amount]);

  const loadSupportedCurrencies = async () => {
    try {
      const data = await exchangeRateService.getSupportedCurrencies();
      if (data.currencies && data.currencies.length > 0) {
        setCurrencies(data.currencies);
      } else {
        setCurrencies(popularCurrencies);
      }
    } catch (error) {
      console.error('Error loading currencies:', error);
      setCurrencies(popularCurrencies);
    }
  };

  const convertCurrency = async () => {
    if (!amount || isNaN(parseFloat(amount))) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (fromCurrency === toCurrency) {
      setResult({
        fromCurrency,
        toCurrency,
        originalAmount: parseFloat(amount),
        convertedAmount: parseFloat(amount),
        exchangeRate: 1,
      });
      return;
    }

    setLoading(true);
    try {
      const conversion = await exchangeRateService.convertCurrency(
        parseFloat(amount),
        fromCurrency,
        toCurrency
      );

      if (conversion.error) {
        toast.error(`Conversion failed: ${conversion.error}`);
      } else {
        setResult(conversion);
        setLastUpdated(conversion.lastUpdated || new Date().toISOString());
      }
    } catch (error) {
      console.error('Error converting currency:', error);
      toast.error('Failed to convert currency');
    } finally {
      setLoading(false);
    }
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setResult(null);
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
      setResult(null);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      convertCurrency();
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className={compact ? 'py-3' : undefined}>
        <CardTitle className={`flex items-center gap-2 ${compact ? 'text-base' : ''}`}>
          <Calculator className="h-5 w-5 text-primary" />
          Currency Converter
        </CardTitle>
      </CardHeader>
      <CardContent className={compact ? 'space-y-3' : 'space-y-4'}>
        {/* Amount Input */}
        <div>
          <label className={`${compact ? 'text-xs' : 'text-sm'} font-medium text-muted-foreground mb-2 block`}>
            Amount
          </label>
          <Input
            type="text"
            value={amount}
            onChange={handleAmountChange}
            onKeyDown={handleKeyDown}
            placeholder="Enter amount"
            className={compact ? 'text-base h-9' : 'text-lg'}
          />
        </div>

        {/* From Currency */}
        <div>
          <label className={`${compact ? 'text-xs' : 'text-sm'} font-medium text-muted-foreground mb-2 block`}>
            From
          </label>
          <Select value={fromCurrency} onValueChange={setFromCurrency}>
            <SelectTrigger className={compact ? 'h-9' : undefined}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((currency) => (
                <SelectItem key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            size={compact ? 'sm' : 'sm'}
            onClick={swapCurrencies}
            className="rounded-full p-2"
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>

        {/* To Currency */}
        <div>
          <label className={`${compact ? 'text-xs' : 'text-sm'} font-medium text-muted-foreground mb-2 block`}>
            To
          </label>
          <Select value={toCurrency} onValueChange={setToCurrency}>
            <SelectTrigger className={compact ? 'h-9' : undefined}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((currency) => (
                <SelectItem key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Convert Button */}
        <Button 
          onClick={convertCurrency} 
          disabled={loading || !amount}
          className={`w-full ${compact ? 'h-9 text-sm' : ''}`}
        >
          {loading ? 'Converting...' : 'Convert'}
        </Button>

        {/* Result */}
        {result && (
          <div className={`bg-muted ${compact ? 'p-3' : 'p-4'} rounded-lg`}>
            <div className="text-center">
              <div className={`${compact ? 'text-xl' : 'text-2xl'} font-bold text-primary`}>
                {exchangeRateService.formatCurrency(result.convertedAmount, result.toCurrency)}
              </div>
              <div className={`${compact ? 'text-xs' : 'text-sm'} text-muted-foreground mt-1`}>
                {exchangeRateService.formatCurrency(result.originalAmount, result.fromCurrency)} = {exchangeRateService.formatCurrency(result.convertedAmount, result.toCurrency)}
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                1 {result.fromCurrency} = {result.exchangeRate?.toFixed(6)} {result.toCurrency}
              </div>
              <div className="flex items-center justify-center gap-3 mt-3">
                <span className="text-xs text-muted-foreground">
                  Last updated: {new Date(lastUpdated || result.lastUpdated).toLocaleString()}
                </span>
                <Button size={compact ? 'xs' : 'sm'} variant="outline" onClick={convertCurrency} disabled={loading}>
                  Refresh
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CurrencyConverter;
