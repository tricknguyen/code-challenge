'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useRef, useMemo } from 'react';
import axios from 'axios';

interface TokenPrice {
  currency: string;
  date: string;
  price: number;
}

interface Token {
  name: string;
  url: string;
  price?: number;
}

const TOKEN_PRICES_URL = "https://interview.switcheo.com/prices.json";
const TOKEN_ICONS_URL = "https://api.github.com/repos/Switcheo/token-icons/contents/tokens";

const TokenSelect = ({ 
  onSelect, 
  value 
}: { 
  onSelect?: (token: Token) => void;
  value?: Token | null;
}) => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTokensAndPrices = async () => {
      try {
        const iconsResponse = await axios.get(TOKEN_ICONS_URL, {
          headers: {
            'Accept': 'application/vnd.github.v3+json'
          }
        });
        const iconsData = iconsResponse.data;

        const pricesResponse = await axios.get<TokenPrice[]>(TOKEN_PRICES_URL);
        const pricesData = pricesResponse.data;

        const latestPrices = pricesData.reduce((acc, curr) => {
          if (!acc[curr.currency] || new Date(acc[curr.currency].date) < new Date(curr.date)) {
            acc[curr.currency] = curr;
          }
          return acc;
        }, {} as Record<string, TokenPrice>);

        const tokenData = iconsData
          .filter((file: { name: string }) => file.name.endsWith(".svg"))
          .map((file: { name: string, download_url: string }) => {
            const name = file.name.replace(".svg", "");
            const price = latestPrices[name]?.price;
            return {
              name,
              url: file.download_url,
              price,
            };
          })
          .filter((token: Token) => token.price !== undefined)
          .sort((a: Token, b: Token) => a.name.localeCompare(b.name));

        setTokens(tokenData);
        setIsLoading(false);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Axios error:", error.response?.data || error.message);
        } else {
          console.error("Error fetching data:", error);
        }
        setIsLoading(false);
      }
    };

    fetchTokensAndPrices();

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTokenSelect = (token: Token) => {
    setIsOpen(false);
    onSelect?.(token);
  };

  if (isLoading) {
    return <span className="loading loading-spinner loading-md"></span>;
  }

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="select select-bordered w-full flex items-center gap-2 cursor-pointer"
      >
        {value ? (
          <>
            <Image
              src={value.url}
              alt={value.name}
              className="w-6 h-6"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://placehold.co/24x24?text=${value.name[0]}`;
              }}
              width={24}
              height={24}
            />
            <span>{value.name.toUpperCase()}</span>
          </>
        ) : (
          <span className="text-gray-500">Choose a token</span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-1 bg-base-100 shadow-lg rounded-lg max-h-[300px] overflow-y-auto z-50">
          <div className="p-2">
            {tokens.map((token) => (
              <button
                key={token.name}
                onClick={() => handleTokenSelect(token)}
                className={`flex items-center gap-2 w-full p-2 hover:bg-base-200 rounded-lg ${
                  value?.name === token.name ? 'bg-base-200' : ''
                }`}
              >
                <Image
                  src={token.url}
                  alt={token.name}
                  className="w-6 h-6"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://placehold.co/24x24?text=${token.name[0]}`;
                  }}
                  width={24}
                  height={24}
                />
                <span>{token.name.toUpperCase()}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const calculateExchangeRate = (fromToken: Token | null, toToken: Token | null) => {
  if (!fromToken?.price || !toToken?.price) return null;
  return fromToken.price / toToken.price;
};

export default function Problem2() {
  const [amount, setAmount] = useState<string>('1.20');
  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);
  const [error, setError] = useState<string>('');

  const exchangeRate = calculateExchangeRate(fromToken, toToken);
  const calculatedAmount = useMemo(() => {
    if (!exchangeRate || !amount) return '0';
    return (parseFloat(amount) * exchangeRate).toFixed(6);
  }, [amount, exchangeRate]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    setError('');

    if (value === '') {
      setAmount(value);
      setError('Amount is required');
      return;
    }

    if (/^\d*\.?\d{0,6}$/.test(value)) {
      setAmount(value);
      if (parseFloat(value) <= 0) {
        setError('Amount must be greater than 0');
      }
    }
  };

  const handleFromTokenSelect = (token: Token) => {
    setFromToken(token);
    if (toToken && token.name === toToken.name) {
      setError('Please select different tokens');
    } else {
      setError('');
    }
  };

  const handleToTokenSelect = (token: Token) => {
    setToToken(token);
    if (fromToken && token.name === fromToken.name) {
      setError('Please select different tokens');
    } else {
      setError('');
    }
  };

  const handleSwap = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setError('');
  };

  return (
    <div className="min-h-screen bg-base-200 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="btn btn-primary btn-outline gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to home
          </Link>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4">
              <div className="form-control w-full h-[85px]">
                <div className="flex justify-between">
                  <label className="label-text">Amount</label>
                  {amount && parseFloat(amount) <= 0 && (
                    <label className="label-text-alt text-error">Must be greater than 0</label>
                  )}
                </div>
                <input
                  type="number"
                  value={amount}
                  onChange={handleAmountChange}
                  className={`input input-bordered w-full ${error && parseFloat(amount) <= 0 ? 'input-error' : ''}`}
                  placeholder="Enter amount"
                  min="0"
                  step="any"
                />
                {error && parseFloat(amount) <= 0 && (
                  <div className="text-error text-sm mt-1">{error}</div>
                )}
              </div>

              <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-4">
                <div className="form-control w-full h-[85px]">
                  <div className="flex justify-between">
                    <label className="label-text">From</label>
                    {error && !fromToken && (
                      <label className="label-text-alt text-error">Required</label>
                    )}
                  </div>
                  <TokenSelect 
                    onSelect={handleFromTokenSelect} 
                    value={fromToken}
                  />
                </div>

                <div className="flex items-center justify-center pt-6">
                  <button 
                    onClick={handleSwap}
                    className="inline-flex rounded-full border border-solid border-gray-250 bg-white p-4 hover:bg-gray-150" 
                    aria-label="Swap currencies" 
                    type="button"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 17" aria-hidden="true" className="h-4 w-4 rotate-90 text-greyblue-400 md:rotate-0">
                      <path fill="currentColor" fillRule="evenodd" d="M11.726 1.273l2.387 2.394H.667V5h13.446l-2.386 2.393.94.94 4-4-4-4-.94.94zM.666 12.333l4 4 .94-.94L3.22 13h13.447v-1.333H3.22l2.386-2.394-.94-.94-4 4z" clipRule="evenodd"></path>
                    </svg>
                  </button>
                </div>

                <div className="form-control w-full h-[85px]">
                  <div className="flex justify-between">
                    <label className="label-text">To</label>
                    {error && !toToken && (
                      <label className="label-text-alt text-error">Required</label>
                    )}
                  </div>
                  <TokenSelect 
                    onSelect={handleToTokenSelect} 
                    value={toToken}
                  />
                </div>
              </div>
            </div>

            <div className="divider"></div>
            <div className="space-y-4">
              {fromToken && toToken && exchangeRate ? (
                <>
                  <div className="text-lg opacity-75">
                    {amount || '0'} {fromToken.name} =
                  </div>
                  <div className="text-4xl font-bold">
                    {calculatedAmount} {toToken.name}
                  </div>
                  <div className="text-sm opacity-70">
                    <div className="flex justify-between items-center">
                      <span>1 {fromToken.name} = {exchangeRate.toFixed(6)} {toToken.name}</span>
                      
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span>1 {toToken.name} = {(1 / exchangeRate).toFixed(6)} {fromToken.name}</span>
                      
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center text-gray-500">
                  {!fromToken || !toToken ? (
                    'Select tokens to see exchange rate'
                  ) : (
                    'Unable to calculate exchange rate'
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}