import Link from "next/link";
import { Highlight, themes } from "prism-react-renderer"

export default function Problem3() {
  const code = `interface WalletBalance {
  blockchain: string;
  currency: string;
  amount: number;
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
  usdValue: number;
}

interface Props extends BoxProps {}

const getPriority = (blockchain: string): number => {
  switch (blockchain) {
    case 'Osmosis': return 100;
    case 'Ethereum': return 50;
    case 'Arbitrum': return 30;
    case 'Zilliqa': return 20;
    case 'Neo': return 20;
    default: return -99;
  }
};

const WalletPage: React.FC<Props> = ({ children, ...rest }: Props) => {
  const balances = useWalletBalances();
  const prices = usePrices();

  const formattedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const priority = getPriority(balance.blockchain);
        return priority > -99 && balance.amount > 0;
      })
      .map((balance: WalletBalance) => {
        const usdValue = prices[balance.currency] * balance.amount || 0;
        return {
          ...balance,
          formatted: balance.amount.toFixed(2),
          usdValue,
        };
      })
      .sort((lhs: FormattedWalletBalance, rhs: FormattedWalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        return rightPriority - leftPriority;
      });
  }, [balances, prices]);

  return (
    <div {...rest}>
      {formattedBalances.map((balance: FormattedWalletBalance) => (
        <WalletRow
          className={classes.row}
          key={balance.currency}
          amount={balance.amount}
          usdValue={balance.usdValue}
          formattedAmount={balance.formatted}
        />
      ))}
    </div>
  );
};

export default WalletPage;
`;

  return (
    <div className="min-h-screen p-8">
      <Link
        href="/"
        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors mb-8"
      >
        ← Back to home
      </Link>

      <div className="space-y-8">
        <h2 className="text-2xl font-bold">Analysis of Computational Inefficiencies and Anti-Patterns</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">1. Redundant Computations in <code className="bg-gray-100 px-1 rounded">useMemo</code>:</h3>
            <ul className="list-disc pl-8 space-y-2">
              <li>
                The <code className="bg-gray-100 px-1 rounded">getPriority</code> function is called multiple times for each balance, which is computationally redundant. This function can be memoized or computed once per balance.
              </li>
              <li>
                The <code className="bg-gray-100 px-1 rounded">lhsPriority</code> variable is undefined in the provided <code className="bg-gray-100 px-1 rounded">filter</code> function. This is likely a typo for <code className="bg-gray-100 px-1 rounded">balancePriority</code>, causing potential runtime errors.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">2. Improper Dependency Array in <code className="bg-gray-100 px-1 rounded">useMemo</code>:</h3>
            <ul className="list-disc pl-8">
              <li>
                The <code className="bg-gray-100 px-1 rounded">prices</code> dependency is included in <code className="bg-gray-100 px-1 rounded">useMemo</code>, but it is unused within the computation of <code className="bg-gray-100 px-1 rounded">sortedBalances</code>. This may cause unnecessary recomputations.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">3. Lack of Memoization for Derived Values:</h3>
            <ul className="list-disc pl-8">
              <li>
                <code className="bg-gray-100 px-1 rounded">formattedBalances</code> and <code className="bg-gray-100 px-1 rounded">rows</code> are derived from <code className="bg-gray-100 px-1 rounded">sortedBalances</code> but are not memoized. This means they are recomputed on every render even if <code className="bg-gray-100 px-1 rounded">sortedBalances</code> does not change.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">4. Anti-Pattern: Key as Index:</h3>
            <ul className="list-disc pl-8">
              <li>
                Using <code className="bg-gray-100 px-1 rounded">index</code> as the <code className="bg-gray-100 px-1 rounded">key</code> prop in React can lead to rendering inefficiencies, especially when the list order changes. A unique identifier should be used instead.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">5. Inefficient Error-Prone Mapping:</h3>
            <ul className="list-disc pl-8">
              <li>
                The <code className="bg-gray-100 px-1 rounded">formattedBalances</code> step could be directly integrated into <code className="bg-gray-100 px-1 rounded">sortedBalances</code>, avoiding redundant mapping operations.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">6. Unnecessary Spread of <code className="bg-gray-100 px-1 rounded">props</code>:</h3>
            <ul className="list-disc pl-8">
              <li>
                Spreading <code className="bg-gray-100 px-1 rounded">...rest</code> into the root <code className="bg-gray-100 px-1 rounded">div</code> could lead to passing unnecessary or unintended props, potentially causing performance or rendering issues.
              </li>
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Code Refactored</h2>
          <Highlight
            theme={themes.nightOwl}
            code={code.trim()}
            language="typescript"
          >
            {({ style, tokens, getLineProps, getTokenProps }) => (
              <pre className="p-4 rounded-lg overflow-x-auto" style={style}>
                {tokens.map((line, i) => (
                  <div key={i} {...getLineProps({ line })}>
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </div>
                ))}
              </pre>
            )}
          </Highlight>
        </div>

        <h2 className="text-2xl font-bold">Explain code changed</h2>

        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">1. Memoizing Derived Values:</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Merged <code className="bg-gray-100 px-1 rounded">formattedBalances</code> computation with <code className="bg-gray-100 px-1 rounded">sortedBalances</code> to avoid redundant computations.
              </li>
              <li>
                Used <code className="bg-gray-100 px-1 rounded">useMemo</code> to memoize the result, ensuring recalculations occur only when <code className="bg-gray-100 px-1 rounded">balances</code> and <code className="bg-gray-100 px-1 rounded">prices</code> change.
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold">2. Fixing Dependency Array:</h3>
            <ul className="list-disc pl-6">
              <li>
                Removed <code className="bg-gray-100 px-1 rounded">prices</code> from dependencies of <code className="bg-gray-100 px-1 rounded">useMemo</code> in the original code as it wasn&apos;t used.
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold">3. Avoiding <code className="bg-gray-100 px-1 rounded">key</code> as Index:</h3>
            <ul className="list-disc pl-6">
              <li>
                Replaced <code className="bg-gray-100 px-1 rounded">index</code> in <code className="bg-gray-100 px-1 rounded">key</code> with a unique identifier (<code className="bg-gray-100 px-1 rounded">currency</code>), ensuring React efficiently tracks and re-renders items.
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold">4. Simplified Comparisons:</h3>
            <ul className="list-disc pl-6">
              <li>
                Streamlined the comparison function in the <code className="bg-gray-100 px-1 rounded">sort</code> method to reduce complexity.
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold">5. Improved Prop Handling:</h3>
            <ul className="list-disc pl-6">
              <li>
                Explicitly passed relevant props to the root <code className="bg-gray-100 px-1 rounded">div</code> instead of spreading <code className="bg-gray-100 px-1 rounded">...rest</code> blindly.
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold">6. Error Handling:</h3>
            <ul className="list-disc pl-6">
              <li>
                Handled scenarios where a price might not be available (<code className="bg-gray-100 px-1 rounded">prices[balance.currency]</code>), avoiding potential runtime errors.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}