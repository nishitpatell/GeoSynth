import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpDown, Calculator } from 'lucide-react';
import { exchangeRateService } from '@/services/exchangeRateService';
import { toast } from 'sonner';

const CurrencyConverter = ({ defaultFromCurrency = 'USD', defaultToCurrency = 'EUR' }) => {
  const [amount, setAmount] = useState('100');
  const [fromCurrency, setFromCurrency] = useState(defaultFromCurrency);
  const [toCurrency, setToCurrency] = useState(defaultToCurrency);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currencies, setCurrencies] = useState([]);

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

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          Currency Converter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Amount Input */}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Amount
          </label>
          <Input
            type="text"
            value={amount}
            onChange={handleAmountChange}
            placeholder="Enter amount"
            className="text-lg"
          />
        </div>

        {/* From Currency */}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            From
          </label>
          <Select value={fromCurrency} onValueChange={setFromCurrency}>
            <SelectTrigger>
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
            size="sm"
            onClick={swapCurrencies}
            className="rounded-full p-2"
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>

        {/* To Currency */}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            To
          </label>
          <Select value={toCurrency} onValueChange={setToCurrency}>
            <SelectTrigger>
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
          className="w-full"
        >
          {loading ? 'Converting...' : 'Convert'}
        </Button>

        {/* Result */}
        {result && (
          <div className="bg-muted p-4 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {exchangeRateService.formatCurrency(result.convertedAmount, result.toCurrency)}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {exchangeRateService.formatCurrency(result.originalAmount, result.fromCurrency)} = {exchangeRateService.formatCurrency(result.convertedAmount, result.toCurrency)}
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                1 {result.fromCurrency} = {result.exchangeRate?.toFixed(6)} {result.toCurrency}
              </div>
              {result.lastUpdated && (
                <div className="text-xs text-muted-foreground mt-1">
                  Last updated: {new Date(result.lastUpdated).toLocaleString()}
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CurrencyConverter;
